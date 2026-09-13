from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from starlette import status
from sqlalchemy import func, select
from sqlalchemy.orm import contains_eager, selectinload, joinedload
import math
from datetime import datetime, timedelta
from typing import List

from app.models import models
from app.db import db_dependency
from app.schema import requests as request_schema
from app.schema import responses as response_schema
from app.utils import yt_fetchers
from app.cache.helpers import parse_yt_video_list
from app.cache import cache, cache_data

videos_router = APIRouter(prefix="/api/videos", tags=["videos"])

@videos_router.get("/random", response_model=List[List[response_schema.VideoListResponse]])
async def get_random_videos(db: db_dependency, payload: request_schema.GetRandVideosRequest = Depends()):
    stmt = (
        select(models.Video)
        .join(models.Video.channel)
        .options(contains_eager(models.Video.channel))
        .order_by(func.random())
        .limit(payload.limit)
    )
    pulled = db.execute(stmt).scalars().all()

    rand_vids = [
        response_schema.VideoListResponse(
            video_id=video.video_id,
            video_title=video.title,
            channel_id=video.channel_id,
            channel_title=video.channel.name,
            thumbnail_url=video.thumbnail_url,
            thumbnail_width=video.thumbnail_width,
            thumbnail_height=video.thumbnail_height,
            duration_sec=video.duration_sec,
        )
        for video in pulled
    ]

    # Prepares data for pagination
    result = []
    start = 0
    length = len(rand_vids)
    for _ in range(math.ceil(payload.limit / payload.videos_per_page)):
        sum = start + payload.videos_per_page
        end = sum if length >= sum else length
        result.append(rand_vids[start:end])
        start = end

    return result


@videos_router.get("/{id}")
async def get_video(id: str, db: db_dependency, bg_task: BackgroundTasks):
    in_db = db.query(models.Video).filter(models.Video.video_id == id).first()

    if in_db:
        return in_db

    fetched = await yt_fetchers.req_yt_video(id)
    parsed = parse_yt_video_list(fetched)

    bg_task.add_task(
        cache.async_cache_videos,
        parsed_video_list=parsed,
        db=db,
    )

    return parsed


@videos_router.post("/{video_id}/history", status_code=status.HTTP_204_NO_CONTENT)
async def cache_to_history(video_id: str, db: db_dependency):
    now = datetime.utcnow()

    exists = db.query(models.History).filter(
        models.History.video_id == video_id,
        models.History.user_id == None,
    ).order_by(models.History.played_at.desc()).first()

    if exists and (exists.played_at + timedelta(minutes=5)) > now:
        raise HTTPException(
            status_code=status.HTTP_304_NOT_MODIFIED,
            detail="Wait for 5 minutes to count in history"
        )

    await cache.cache_history(video_id=video_id, db=db)
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
from app.utils.helpers import parse_yt_video_list
from app.schema.helpers import mapVideoListResponse

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
        mapVideoListResponse(video)
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


@videos_router.get("/local", response_model=List[response_schema.VideoListResponse])
async def search_local(query: str, db: db_dependency):
    query = db.execute(
        select(models.Video)
        .where(models.Video.title.ilike(f"%{query}%"))
    ).scalars().all()

    return [
        mapVideoListResponse(video)
        for video in query
    ]


@videos_router.get("/{video_id}", response_model=response_schema.VideoListResponse)
async def get_video(video_id: str, db: db_dependency, bg_task: BackgroundTasks):
    in_db = (
        db.query(models.Video)
        .options(selectinload(models.Video.channel))
        .filter(models.Video.video_id == video_id)
        .first()
    )

    if in_db:
        return mapVideoListResponse(in_db)

    fetched = await yt_fetchers.req_yt_video(video_id)
    parsed = parse_yt_video_list(fetched)

    bg_task.add_task(
        cache.async_cache_videos,
        parsed_video_list=parsed,
        db=db,
    )

    return mapVideoListResponse(parsed)


@videos_router.post("/next_video", status_code=status.HTTP_201_CREATED)
async def to_next_video(init_id: str, next_id: str, db: db_dependency):
    exists = (
        db.query(models.NextVideo)
        .filter(
            models.NextVideo.init_video_id == init_id,
            models.NextVideo.next_video_id == next_id
        ).first()
    )

    if exists:
        exists.count =+ 1
        raise HTTPException(
            status_code=status.HTTP_204_NO_CONTENT,
            detail="Count modified."
        )

    db.add(models.NextVideo(
        init_video_id = init_id,
        next_video_id = next_id,
        count = 1
    ))
    db.commit()
    


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
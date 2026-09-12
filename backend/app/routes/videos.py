from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import contains_eager
import math
from typing import List 

from app.models import models
from app.db import db_dependency
from app.schema import requests as request_schema
from app.schema import responses as response_schema

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
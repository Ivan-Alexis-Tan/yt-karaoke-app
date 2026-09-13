from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from starlette import status
from sqlalchemy import func, select
from sqlalchemy.orm import contains_eager, selectinload, joinedload
import math
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


@videos_router.get("/fix")
async def edit_thumbnails_data(query: str, db: db_dependency):
    cache = db.query(models.SearchCache).options(
        selectinload(models.SearchCache.search_cache_videos).selectinload(models.SearchCacheVideo.video)
    ).filter(models.SearchCache.query == query).all()

    # videos = cache[0].search_cache_videos

    # videos_before = [
    #     {
    #         "video_id": video.video_id,
    #         "thumbnail_width": video.video.thumbnail_width,
    #         "thumbnail_height": video.video.thumbnail_height,
    #     } 
    #     for video in videos
    # ]

    # video_ids = [video["video_id"] for video in videos_before]
    # print(f"{video_ids = }")

    # # fetched = await yt_fetchers.req_yt_video(video_ids)
    # fetched = cache_data.spongecola_videos
    # parsed = parse_yt_video_list(fetched)

    # for video in videos:
    #     video.video.thumbnail_width = 640
    #     video.video.thumbnail_height = 480

    # urls = [
    #     {
    #         "video_id": video.video_id,
    #         "url": video.video.thumbnail_url,
    #     }
    #     for video in videos
    # ]

    # for i in urls:
    #     url_splitted = i["url"].split("/")
    #     corrected = url_splitted[0:5]
    #     corrected.append("sddefault.jpg")
    #     joined = "/".join(corrected) 

    #     print(f"{url_splitted = }")
    #     print(f"{corrected = }")
    #     print(f"{joined = }")
    #     print("==============")

    #     video_db = db.query(models.Video).filter(models.Video.video_id == i["video_id"]).first()
    #     video_db.thumbnail_url = joined
    #     video_db.thumbnail_width = 640
    #     video_db.thumbnail_height = 480

    #     db.commit()
        
    return cache


@videos_router.get("/fix")
async def fix_video(video_id: str, fix: str, db: db_dependency):
    fix_methods = ("thumbnail_url")

    if fix not in fix_methods:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid request"
        )

    video = db.query(models.Video).filter(models.Video.video_id == video_id).first()

    match fix:
        case "thumbnail_url":
            url = (video.thumbnail_url).split("/")
            corrected = url[0:5]
            corrected.append("sddefault.jpg")
            joined = "/".join(corrected) 

            video.thumbnail_url = joined
            video.thumbnail_width = 640
            video.thumbnail_height = 480

            db.commit()

            return video


@videos_router.get("/{id}")
async def get_video(id: str, db: db_dependency, bg_task: BackgroundTasks):
    in_db = db.query(models.Video).filter(models.Video.video_id == id).first()

    if in_db:
        bg_task.add_task(
            cache.cache_history, 
            video_id=in_db.video_id,
            db=db
        )
        return in_db

    fetched = await yt_fetchers.req_yt_video(id)
    parsed = parse_yt_video_list(fetched)

    bg_task.add_task(
        cache.async_cache_videos,
        parsed_video_list=parsed,
        db=db,
    )

    return parsed
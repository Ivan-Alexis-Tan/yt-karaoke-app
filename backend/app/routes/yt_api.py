from fastapi import APIRouter, BackgroundTasks
from sqlalchemy.orm import selectinload
import httpx
from datetime import datetime
from typing import List

from app.core import config
from app.cache.helpers import async_cache_yt_search, async_cache_videos, parse_yt_search, ytSearchResult
from app.db import db_dependency
from app.models import models
from app.schema import responses as response_schema

yt_router = APIRouter(prefix="/api/youtube", tags=["youtube"])

@yt_router.get("/search", response_model=List[response_schema.SearchResultResponse])
async def yt_search(query: str, db: db_dependency, bg_task: BackgroundTasks):
    lowered_query: str = query.lower()
    now = datetime.utcnow()
    exists = db.query(models.SearchCache).filter(models.SearchCache.query == lowered_query).first()

    # If Exists and Not Expired
    if exists and exists.expires_at > now:
        print(">>> Pulled data from DB.")

        db_returned = db.query(models.SearchCacheVideo).options(
            selectinload(models.SearchCacheVideo.video)
                .joinedload(models.Video.channel)
        ).filter(models.SearchCacheVideo.search_id == exists.id).all()

        return [
            response_schema.SearchResultResponse(
                position=cache.position,
                video_id=cache.video_id,
                video_title=cache.video.title,
                channel_id=cache.video.channel.channel_id,
                channel_title=cache.video.channel.name,
                thumbnail_url=cache.video.thumbnail_url,
                thumbnail_width=cache.video.thumbnail_width,
                thumbnail_height=cache.video.thumbnail_height,
                duration_sec=cache.video.duration_sec
            )
            for cache in db_returned
        ]

    print(">>> Query not cached yet")

    # YT API Request Func
    async def api_req():
        params = {
            "part": "snippet",
            "q": f"{lowered_query} karaoke",
            "type": "video",
            "maxResults": 10,
            "key": config.API_KEY,
        }

        async with httpx.AsyncClient() as client:
            print('>> (api_req): Called the YT `search.list` API')
            response = await client.get(
                url=f"{config.YOUTUBE_URL}/search",
                params=params
            )
            response.raise_for_status()
            return response.json()


    search_api = await api_req()
    parsed = parse_yt_search(search_api)

    # Background process for adding data to DB
    bg_task.add_task(
        async_cache_yt_search,
        query_key=lowered_query,
        etag=search_api["etag"],
        parsed_yt_search_data=parsed,
        db=db,
    )

    return [
        response_schema.SearchResultResponse(
            position=video["position"],
            video_id=video["video_id"],
            video_title=video["title"],
            channel_id=video["channel_id"],
            channel_title=video["channel_title"],
            thumbnail_url=video["thumbnail_url"],
            thumbnail_width=video["thumbnail_width"],
            thumbnail_height=video["thumbnail_height"],
            duration_sec=None
        )
        for video in parsed
    ]

    # return parsed


@yt_router.get("/video/{id}")
async def get_video(id: str):
    params = {
        "id": id,
        "part": "snippet,contentDetails",
        "key": config.API_KEY
    }

    async def api_req():
        async with httpx.AsyncClient() as client:
            print(">> Called the YT API")
            response = await client.get(
                url=f"{config.YOUTUBE_URL}/videos",
                params=params
            )
            response.raise_for_status()
            return response.json()


    result = await async_cache_videos(
        vid_id=id,
        api_fn=api_req,
    )

    return result
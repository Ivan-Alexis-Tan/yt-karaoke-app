from fastapi import APIRouter, BackgroundTasks
from sqlalchemy.orm import selectinload
from datetime import datetime
from typing import List

from app.utils import parsers, cache, db_checkers
from app.utils.yt_fetchers import req_yt_search
from app.db import db_dependency
from app.models import models
from app.schema import responses as response_schema
from app.schema.mappers import mapVideoListResponse

yt_router = APIRouter(prefix="/api/youtube", tags=["youtube"])

@yt_router.get("/search", response_model=List[response_schema.VideoListResponse])
async def yt_search(query: str, db: db_dependency, bg_task: BackgroundTasks):
    lowered_query: str = query.lower()
    now = datetime.utcnow()
    exists = db.query(models.SearchCache).filter(models.SearchCache.query == lowered_query).first()

    # If Exists and Not Expired
    if exists and exists.expires_at > now:
        print(">>> Pulled data from DB.")

        db_returned = (
            db.query(models.SearchCacheVideo)
            .options(
                selectinload(models.SearchCacheVideo.video)
                    .joinedload(models.Video.channel)
            )
            .filter(models.SearchCacheVideo.search_id == exists.id)
            .all()
        )

        # Excluding banned channels
        channel_ids = {cache_video.video.channel_id for cache_video in db_returned}
        banned_channels = db_checkers.sift_banned_channels(channel_ids, db)

        if len(banned_channels) >= 1:
            sifted = [
                cache_video.video for cache_video in db_returned
                if cache_video.video.channel_id not in banned_channels
            ]
        else:
            sifted = db_returned
        
        return [
            mapVideoListResponse(video)
            for video in sifted
        ]

    print(">>> Query not cached yet")

    # YT API Request Func
    search_api = await req_yt_search(query=lowered_query, max_results=20)
    parsed = parsers.parse_yt_search(search_api)

    # Excluding videos of banned channels
    channel_ids = {video["channel_id"] for video in parsed}
    banned_channels = db_checkers.sift_banned_channels(channel_ids, db)

    if len(banned_channels) >= 1:
        sifted = [
            video for video in parsed
            if video["channel_id"] not in banned_channels
        ]
    else:
        sifted = parsed

    # Background process for adding data to DB
    bg_task.add_task(
        cache.async_cache_yt_search,
        query_key=lowered_query,
        etag=search_api["etag"],
        parsed_yt_search_data=sifted,
        db=db,
    )

    return [
        mapVideoListResponse(video)
        for video in sifted
    ]
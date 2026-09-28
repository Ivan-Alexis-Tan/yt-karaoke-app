from fastapi import APIRouter, BackgroundTasks
from sqlalchemy.orm import selectinload
from datetime import datetime
from typing import List

from app.utils.helpers import async_cache_yt_search, parse_yt_search
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

        return [
            mapVideoListResponse(cache)
            for cache in db_returned
        ]

    print(">>> Query not cached yet")

    # YT API Request Func
    search_api = await req_yt_search(lowered_query)
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
        mapVideoListResponse(video)
        for video in parsed
    ]
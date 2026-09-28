from datetime import datetime, timedelta
from sqlalchemy import select
from typing import TypedDict

from app.type.parsed_YtApi import ParsedYtSearch

from app.db import db_dependency
from app.models import models
from app.utils import db_checkers, yt_fetchers, parsers

class ToSearchCacheVideosType(TypedDict):
    search_id: str
    video_id: str
    channel_id: str
    channel_title: str
    position: int | None


async def async_cache_yt_search(
    query_key: str, 
    etag: str, 
    parsed_yt_search_data: list[ParsedYtSearch], 
    db: db_dependency, 
    ttl_min: int = 60
):
    now = datetime.utcnow()
    query_exists = db.query(models.SearchCache).filter(models.SearchCache.query == query_key).first()
    query_cache = None

    # Updating/Creating search key to SearchCache table
    if query_exists:
        query_exists.expires_at = now + timedelta(minutes=ttl_min)
        db.flush()
        query_cache = query_exists
    else:
        new_search_cache = models.SearchCache(
            query=query_key,
            etag=etag,
            created_at=now,
            expires_at=now + timedelta(minutes=ttl_min)
        )

        db.add(new_search_cache)
        db.flush()
        query_cache = new_search_cache

    # Mapping videos and channels return from API response
    to_search_cache_videos: list[ToSearchCacheVideosType] = []
    video_ids = []
    channel_ids: dict[str, str] = {}

    for video in parsed_yt_search_data:
        to_search_cache_videos.append({
            "search_id": query_cache.id,
            "video_id": video["video_id"],
            "channel_id": video["channel_id"],
            "channel_title": video["channel_title"],
            "position": video["position"],
        })

        video_ids.append(video["video_id"])
        channel_ids[video["channel_id"]] = video["channel_title"]


    # Mapping Non-existing data for videos and channels
    not_in_video_tbl = db_checkers.not_in_videos_tbl(video_ids, db)
    no_existing_channel = db_checkers.not_in_channels_tbl(channel_ids.keys(), db)

    # Creating DB row for channels if it does not exists in DB
    if len(no_existing_channel) >= 1:
        list_create_channel = []
        for channel_id in no_existing_channel:
            list_create_channel.append(models.Channel(
                channel_id = channel_id,
                name = channel_ids[channel_id],
            ))

        db.add_all(list_create_channel)
        db.flush()

    # Create row of videos if it does not exists in DB 
    if len(not_in_video_tbl) >= 1:
        new_video_rows = await create_video_rows(not_in_video_tbl)
        db.add_all(new_video_rows)

    # Create SearchCacheVideo table row if it does not exists
    in_search_cache_video = db.execute(
        select(models.SearchCacheVideo.video_id)
        .filter(models.SearchCacheVideo.search_id == query_cache.id)
    ).scalars().all()

    not_in_search_cache_video = [
        video
        for video in to_search_cache_videos 
        if video["video_id"] not in in_search_cache_video
    ]
    
    if len(not_in_search_cache_video) >= 1:
        new_search_cache_videos = []
        for cache in not_in_search_cache_video:
            new_search_cache_videos.append(models.SearchCacheVideo(
                search_id = cache["search_id"],
                video_id = cache["video_id"],
                position = cache["position"],
            ))

        db.add_all(new_search_cache_videos)
        print(">>> async_cache_yt_search(): `new_search_cache_videos` saved to DB")
          
    db.commit()


async def create_video_rows(video_ids: list[str]):
    yt_video_list = await yt_fetchers.req_yt_video(video_ids)
    parsed_video_list = parsers.parse_yt_video_list(yt_video_list)

    new_video_rows = []
    for video in parsed_video_list:
        statistics_data = video["statistics"]
        
        new_video_rows.append(models.Video(
            video_id = video["video_id"],
            title = video["video_title"],
            channel_id = video["channel_id"],
            thumbnail_url = video["thumbnail_url"],
            thumbnail_width = video["thumbnail_width"],
            thumbnail_height = video["thumbnail_height"],
            duration_sec = video["duration_sec"],
            statistics = models.Statistics(
                view_count = statistics_data["view_count"],
                like_count = statistics_data["like_count"],
                comment_count = statistics_data["comment_count"]
            )
        ))

    return new_video_rows
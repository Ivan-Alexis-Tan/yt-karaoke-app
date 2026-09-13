from datetime import datetime, timedelta

from app.cache.cache_data import cache, ytSearchResult, ytVideo
from app.db import SessionLocal, db_dependency
from app.models import models
from app.utils import yt_fetchers

def duration_to_seconds(duration: str):
    duration = duration.removeprefix("PT")
    time = {
        "hour": 0,
        "minutes": 0,
        "seconds": 0,
    }

    if "H" in duration:
        hour, duration = duration.split("H")
        time["hour"] = hour * 60 * 60

    if "M" in duration:
        minutes, duration = duration.split('M')
        time["minutes"] = int(minutes) * 60

    if "S" in duration:
        seconds, duration = duration.split("S")
        time["seconds"] = int(seconds)

    return sum(time.values())


def parse_yt_search(data: dict):
    parsed = []
    items: list = data["items"]

    for idx, item in enumerate(items, start=1):
        snippet = item["snippet"]
        thumbnail = snippet["thumbnails"]["medium"]

        data: dict = {
            "position": idx,
            "video_id": item["id"]["videoId"],
            "title": snippet["title"],
            "channel_id": snippet["channelId"],
            "channel_title": snippet["channelTitle"],
            "thumbnail_url": thumbnail["url"],
            "thumbnail_width": thumbnail["width"],
            "thumbnail_height": thumbnail["height"],
        }

        parsed.append(data)

    return parsed


def parse_yt_video_list(video_list: dict):
    parsed_list = []

    for video in video_list["items"]:
        snippet = video["snippet"]
        thumbnail = snippet["thumbnails"]["standard"]
        duration = video["contentDetails"]["duration"]
        statistics = video["statistics"]
        
        snippet_keys = snippet.keys()
        statistics_keys = statistics.keys()

        parsed_list.append({
            "video_id": video["id"],
            "title": snippet["title"],
            "thumbnail_url": thumbnail["url"],
            "thumbnail_width": thumbnail["width"],
            "thumbnail_height": thumbnail["height"],
            "channel_id": snippet['channelId'],
            "channel_title": snippet["channelTitle"],
            "duration_sec": duration_to_seconds(duration),
            "tags": snippet["tags"] if "tags" in snippet_keys else [],
            "category_id": snippet["categoryId"] if "categoryId" in snippet_keys else None,
            "statistics": {
                "view_count": statistics["viewCount"] if "viewCount" in statistics_keys else None,
                "like_count": statistics["likeCount"] if "likeCount" in statistics_keys else None,
                "comment_count": statistics["commentCount"] if "likeCount" in statistics_keys else None,
            }
        })

    return parsed_list


async def async_cache_yt_search(
    query_key: str, 
    etag: str, 
    parsed_yt_search_data: dict, 
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
    to_search_cache_videos = [
        {
            "search_id": query_cache.id,
            "video_id": video["video_id"],
            "channel_id": video["channel_id"],
            "channel_title": video["channel_title"],
            "position": video["position"],
            "in_videos_tbl": bool(db.query(models.Video).filter(models.Video.video_id == video["video_id"]).first()),
            "channel_exists": bool(db.query(models.Channel).filter(models.Channel.channel_id == video["channel_id"]).first()),
        }
        for video in parsed_yt_search_data
    ]

    # Mapping Non-existing data for videos and channels
    not_in_video_tbl = [
        video["video_id"]
        for video in to_search_cache_videos if video["in_videos_tbl"] == False
    ]
    no_existing_channel: dict = {
        video["channel_id"]: video["channel_title"]
        for video in to_search_cache_videos 
        if video["channel_exists"] == False
    }

    # Creating DB row for channels if it does not exists in DB
    if len(no_existing_channel) >= 1:
        list_create_channel = []
        for channel_id, channel_title in no_existing_channel.items():
            list_create_channel.append(models.Channel(
                channel_id = channel_id,
                name = channel_title,
            ))

        db.add_all(list_create_channel)
        db.flush()

    # Create row of videos if it does not exists in DB 
    if len(not_in_video_tbl) >= 1:
        yt_video_list = await yt_fetchers.req_yt_video(not_in_video_tbl)
        parsed_video_list = parse_yt_video_list(yt_video_list)

        new_video_rows = []
        for video in parsed_video_list:
            statistics_data = video["statistics"]
            
            new_video_rows.append(models.Video(
                video_id = video["video_id"],
                title = video["title"],
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

        db.add_all(new_video_rows)

    # Create SearchCacheVideo table row if it does not exists
    in_search_cache_video = db.query(models.SearchCacheVideo).filter(models.SearchCacheVideo.search_id == query_cache.id).first()

    if not in_search_cache_video:
        new_search_cache_videos = []
        for cache in to_search_cache_videos:
            new_search_cache_videos.append(models.SearchCacheVideo(
                search_id = cache["search_id"],
                video_id = cache["video_id"],
                position = cache["position"],
            ))

        db.add_all(new_search_cache_videos)
        print(">>> async_cache_yt_search(): `new_search_cache_videos` saved to DB")

    db.commit()

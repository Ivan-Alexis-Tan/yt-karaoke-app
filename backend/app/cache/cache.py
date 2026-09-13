from datetime import datetime

from app.db import db_dependency
from app.models import models

async def async_cache_videos(parsed_video_list: dict, db: db_dependency) -> None:
    now = datetime.utcnow()

    db_checker_mapped = [
        {
            "video_id": video["video_id"],
            "channel_id": video["channel_id"],
            "channel_title": video["channel_title"],
            "channel_exists": db.query(models.Channel).filter(models.Channel.channel_id == video['channel_id']).first(),
        }
        for video in parsed_video_list
    ]

    no_channel = [
        video
        for video in db_checker_mapped if not video["channel_exists"]
    ]

    if len(no_channel) >= 1:
        new_channels = []
        for video in no_channel:
            new_channels.append(models.Channel(
                channel_id=video['channel_id'],
                name=video['channel_title']
            ))

        db.add_all(new_channels)
        db.flush()

    new_videos = [
        models.Video(
            video_id=video["video_id"],
            title=video["title"],
            channel_id=video["channel_id"],
            thumbnail_url=video["thumbnail_url"],
            thumbnail_width=video["thumbnail_width"],
            thumbnail_height=video["thumbnail_height"],
            duration_sec=video["duration_sec"],
        )
        for video in parsed_video_list
    ]

    db.add_all(new_videos)
    db.flush()

    new_history = [
        models.History(
            user_id=None,
            video_id=video['video_id'],
            played_at=now,
        )
        for video in parsed_video_list
    ]

    db.add_all(new_history)
    db.commit()


async def cache_history(video_id: str, db: db_dependency, current_user = None) -> None:
    now = datetime.utcnow()

    db.add(
        models.History(
            user_id=current_user,
            video_id=video_id,
            played_at=now
        )
    )
    db.commit()
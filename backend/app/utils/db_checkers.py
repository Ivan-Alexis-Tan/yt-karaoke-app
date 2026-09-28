from app.db import db_dependency
from app.models import models

def not_in_videos_tbl(video_ids: list[str], db: db_dependency) -> list[str]:
    query = (
        db.query(models.Video)
        .filter(models.Video.video_id.in_(video_ids))
        .all()
    )

    in_db = [video.video_id for video in query]

    return [
        video_id
        for video_id in video_ids
        if video_id not in in_db
    ]


def not_in_channels_tbl(channel_ids: list[str], db: db_dependency) -> list[str]:
    query = (
        db.query(models.Channel)
        .filter(models.Channel.channel_id.in_(channel_ids))
        .all()
    ) 

    in_db = [channel.channel_id for channel in query]

    return [
        channel_id for channel_id in channel_ids
        if channel_id not in in_db
    ]
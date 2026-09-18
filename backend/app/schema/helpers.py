from app.models import models
from app.schema.responses import VideoListResponse

def mapVideoListResponse(video: dict | models.Video) -> VideoListResponse:
    if type(video) != dict:
        return VideoListResponse(
            video_id=video.video_id,
            video_title=video.title,
            channel_id=video.channel_id,
            channel_title=video.channel.name,
            thumbnail_url=video.thumbnail_url,
            thumbnail_width=video.thumbnail_width,
            thumbnail_height=video.thumbnail_height,
            duration_sec=video.duration_sec,
        )

    vid_duration = video["duration_sec"] if video["duration_sec"] in video.keys() else None
    return VideoListResponse(
        video_id=video["video_id"],
        video_title=video["video_title"],
        channel_id=video["channel_id"],
        channel_title=video["channel_title"],
        thumbnail_url=video["thumbnail_url"],
        thumbnail_width=video["thumbnail_width"],
        thumbnail_height=video["thumbnail_height"],
        duration_sec=vid_duration,
    )
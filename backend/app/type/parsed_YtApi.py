from typing import TypedDict

from app.type.yt_video_response import VideoStatistics

class ParsedYtVideo(TypedDict):
    video_id: str
    video_title: str
    channel_id: str
    channel_title: str
    thumbnail_url: str
    thumbnail_width: int
    thumbnail_height: int
    duration_sec: int
    tags: list[str]
    category_id: str | None
    statistics: VideoStatistics


class ParsedYtSearch(TypedDict):
    position: int
    video_id: str
    video_title: str
    channel_id: str
    channel_title: str
    thumbnail_url: str
    thumbnail_width: int
    thumbnail_height: int
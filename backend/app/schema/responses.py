from pydantic import BaseModel

class VideoListResponse(BaseModel):
    position: int | None = None
    video_id: str
    video_title: str
    channel_id: str
    channel_title: str
    thumbnail_url: str
    thumbnail_width: int
    thumbnail_height: int
    duration_sec: int | None = None
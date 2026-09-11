from pydantic import BaseModel

class SearchResultResponse(BaseModel):
    position: int
    video_id: str
    video_title: str
    channel_id: str
    channel_title: str
    thumbnail_url: str
    thumbnail_width: int
    thumbnail_height: int
    duration_sec: int | None
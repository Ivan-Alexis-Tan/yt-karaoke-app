from pydantic import BaseModel
from datetime import datetime

from app.models.models import UserRole

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


class CurrentUserResponse(BaseModel):
    auth_id: str
    provider: str
    email: str | None = None
    name: str | None = None
    picture: str | None = None
    created_at: datetime
    role: UserRole


class BannedChannelsResponse(BaseModel):
    channel_id: str
    channel_title: str
    date: datetime


class BannedVideosResponse(BaseModel):
    date: datetime
    video_id: str
    video_title: str
    channel_id: str
    channel_title: str
    thumbnail_url: str
    duration_sec: int
from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from typing import Literal

from app.models.models import UserRole, BanRequestStatus

class BanRequestUser(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    auth_id: str
    email: str | None
    name: str | None
    picture: str | None
    role: UserRole


class BanRequestChannel(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    channel_id: str
    channel_title: str = Field(validation_alias="name")


class BanRequestVideo(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    video_id: str
    video_title: str = Field(validation_alias='title')
    thumbnail_url: str
    duration_sec: int
    channel: BanRequestChannel


class BanRequestResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    date: datetime
    video_id: str
    reason: str | None
    status: BanRequestStatus
    requested_by: str
    requested_user: BanRequestUser
    reviewed_at: datetime | None
    reviewed_by: BanRequestUser | None
    video: BanRequestVideo
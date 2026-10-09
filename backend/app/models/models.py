from sqlalchemy import (
    String, 
    Text, 
    ForeignKey, 
    UniqueConstraint, 
    Enum as SAEnum
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
import uuid
from datetime import datetime
from typing import Optional
import enum

class UserRole(enum.Enum):
    USER = "user"
    ADMIN = "admin"


class BanRequestStatus(str, enum.Enum):
    PENDING = 'pending'
    APPROVED = 'approved'
    REJECTED = 'rejected'


class BaseModel(DeclarativeBase):
    __abstract__ = True

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )


class User(BaseModel):
    __tablename__ = "users"

    auth_id: Mapped[str] = mapped_column()
    provider: Mapped[str] = mapped_column(String(50))
    email: Mapped[str | None] = mapped_column(index=True)
    name: Mapped[str | None] = mapped_column()
    picture: Mapped[str | None] = mapped_column()
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    role: Mapped[UserRole] = mapped_column(
        SAEnum(UserRole, name="user_role"),
        default=UserRole.USER,
    )

    __table_args__ = (
        UniqueConstraint(
            "auth_id",
            "provider",
            name="user_auth_provider_pair"
        ),
    )

    history: Mapped[list["History"]] = relationship(back_populates="user")


class Video(BaseModel):
    __tablename__ = "videos"

    video_id: Mapped[str] = mapped_column(String(50), unique=True)
    title: Mapped[str] = mapped_column(Text)
    channel_id: Mapped[str] = mapped_column(ForeignKey("channels.channel_id"))
    thumbnail_url: Mapped[str] = mapped_column(Text)
    thumbnail_width: Mapped[int]
    thumbnail_height: Mapped[int]
    duration_sec: Mapped[int]

    history: Mapped[list["History"]] = relationship(back_populates="video")
    channel: Mapped["Channel"] = relationship(back_populates="videos")
    statistics: Mapped["Statistics"] = relationship(back_populates="video")
    banned_video: Mapped["BannedVideo | None"] = relationship(
        back_populates="video",
        uselist=False,
    )


class Channel(BaseModel):
    __tablename__ = "channels"

    channel_id: Mapped[str] = mapped_column(unique=True)
    name: Mapped[str] = mapped_column(String(50))

    videos: Mapped[list["Video"]] = relationship(back_populates='channel')
    banned_videos: Mapped[list["BannedVideo"]] = relationship(back_populates='channel')


class History(BaseModel):
    __tablename__ = "history"

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=True)
    video_id: Mapped[str] = mapped_column(ForeignKey("videos.video_id"))
    played_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    video: Mapped["Video"] = relationship(back_populates="history")
    user: Mapped[Optional["User"]] = relationship(back_populates="history")


class SearchCache(BaseModel):
    __tablename__ = "search_cache"

    query: Mapped[str] = mapped_column(String(255), unique=True)
    etag: Mapped[str] = mapped_column(String(50), unique=True)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    expires_at: Mapped[datetime]

    search_cache_videos: Mapped[list["SearchCacheVideo"]] = relationship(
        back_populates="search"
    )


class SearchCacheVideo(BaseModel):
    __tablename__ = "search_cache_videos"

    search_id: Mapped[str] = mapped_column(ForeignKey("search_cache.id"))
    video_id: Mapped[str] = mapped_column(ForeignKey("videos.video_id"))
    position: Mapped[int]

    search: Mapped["SearchCache"] = relationship(back_populates="search_cache_videos")
    video: Mapped["Video"] = relationship()


class Statistics(BaseModel):
    __tablename__ = "statistics"

    video_id: Mapped[str] = mapped_column(ForeignKey("videos.video_id"), unique=True, nullable=True)
    view_count: Mapped[int] = mapped_column(nullable=True)
    like_count: Mapped[int] = mapped_column(nullable=True)
    comment_count: Mapped[int] = mapped_column(nullable=True)

    video: Mapped[Optional["Video"]] = relationship(back_populates="statistics")


class NextVideo(BaseModel):
    __tablename__ = "next_videos"

    init_video_id: Mapped[str] = mapped_column(ForeignKey("videos.video_id"))
    next_video_id: Mapped[str] = mapped_column(ForeignKey("videos.video_id"))
    count: Mapped[int]

    next_video: Mapped["Video"] = relationship(foreign_keys=[next_video_id])

    __table_args__ = (
        UniqueConstraint(
            "init_video_id",
            "next_video_id",
            name="unq_next_video_pair"
        ),
    )


class BannedVideo(BaseModel):
    __tablename__ = "banned_videos"

    video_id: Mapped[str] = mapped_column(ForeignKey('videos.video_id'), unique=True)
    channel_id: Mapped[str] = mapped_column(ForeignKey('channels.channel_id'), index=True)
    date: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    request_id: Mapped[Optional[str]] = mapped_column(ForeignKey('ban_requests.id'))

    video: Mapped["Video"] = relationship(back_populates="banned_video")
    channel: Mapped["Channel"] = relationship(back_populates="banned_videos")
    ban_request: Mapped[Optional["BanRequest"]] = relationship()


class BanRequest(BaseModel):
    __tablename__ = "ban_requests"

    date: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    video_id: Mapped[str] = mapped_column(ForeignKey('videos.video_id'), unique=True)
    reason: Mapped[Optional[str]] = mapped_column(Text)
    requested_by: Mapped[Optional[str]] = mapped_column(ForeignKey('users.id'))
    status: Mapped[BanRequestStatus] = mapped_column(
        SAEnum(BanRequestStatus, name="ban_request_status"), 
        default=BanRequestStatus.PENDING
    )
    reviewed_at: Mapped[Optional[datetime]] = mapped_column()
    reviewed_by: Mapped[Optional[str]] = mapped_column(ForeignKey('users.id'))

    video: Mapped['Video'] = relationship()
    requested_user: Mapped[Optional['User']] = relationship(foreign_keys=[requested_by])
    reviewed_user: Mapped[Optional['User']] = relationship(foreign_keys=[reviewed_by])
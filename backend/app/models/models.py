from sqlalchemy import String, Text, ForeignKey
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
import uuid
from datetime import datetime
from typing import Optional

class BaseModel(DeclarativeBase):
    __abstract__ = True

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )


class User(BaseModel):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column()
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    history: Mapped[list["History"]] = relationship(back_populates="user")


class Video(BaseModel):
    __tablename__ = "videos"

    video_id: Mapped[str] = mapped_column(String(50), unique=True)
    title: Mapped[str] = mapped_column(String(99))
    channel_id: Mapped[str] = mapped_column(ForeignKey("channels.channel_id"))
    thumbnail_url: Mapped[str] = mapped_column(Text)
    thumbnail_width: Mapped[int]
    thumbnail_height: Mapped[int]
    duration_sec: Mapped[int]

    history: Mapped[list["History"]] = relationship(back_populates="video")
    channel: Mapped["Channel"] = relationship(back_populates="videos")
    statistics: Mapped["Statistics"] = relationship(back_populates="video")


class Channel(BaseModel):
    __tablename__ = "channels"

    channel_id: Mapped[str] = mapped_column(unique=True)
    name: Mapped[str] = mapped_column(String(50))

    videos: Mapped[list["Video"]] = relationship(back_populates='channel')


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
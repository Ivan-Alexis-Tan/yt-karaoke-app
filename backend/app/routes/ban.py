from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload, joinedload
from typing import List
from starlette import status

from app.db import db_dependency
from app.auth.auth import CurrentUser, not_authorized_exception
from app.models import models
from app.schema.responses import BannedChannelsResponse

ban_router = APIRouter(prefix="/api/ban", tags=["banned"])
security = HTTPBearer()

@ban_router.get("/videos/total_rows")
def banned_videos_count(db: db_dependency):
    return db.execute(
        select(func.count(models.BannedVideo.video_id))
    ).scalar()


@ban_router.get("/videos", response_model=List[BannedVideosResponse])
def get_banned_videos(db: db_dependency, page: int = 1):
    if page <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Page can't be less than or equal to 0"
        )
    
    total_rows = db.execute(
        select(
            func.count(models.BannedVideo.video_id)
        )
    ).scalar()

    max_page = total_rows / 5
    if page > max_page:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Max page reached"
        )

    query = db.execute(
        select(models.BannedVideo)
        .options(
            joinedload(models.BannedVideo.video),
            joinedload(models.BannedVideo.channel)
        )
        .order_by(models.BannedVideo.date.desc())
        .limit(page * 5)
    ).scalars().all()

    return [
        BannedVideosResponse(
            date = banned_video.date,
            video_id = banned_video.video_id,
            video_title = banned_video.video.title,
            channel_id = banned_video.channel_id,
            channel_title = banned_video.channel.name,
            thumbnail_url = banned_video.video.thumbnail_url,
            duration_sec = banned_video.video.duration_sec,
        )
        for banned_video in query
    ]


@ban_router.get("/channels", response_model=List[BannedChannelsResponse])
def get_banned_channels(db: db_dependency, page: int = 1):
    earliest_date = func.min(models.BannedVideo.date).label("date")
    return db.execute(
        select(
            models.BannedVideo.channel_id.label("channel_id"),
            models.Channel.name.label("channel_title"),
            earliest_date
        )
        .join(
            models.Channel, 
            models.Channel.channel_id == models.BannedVideo.channel_id
        )
        .group_by(
            models.BannedVideo.channel_id,
            models.Channel.name
        )
        .order_by(earliest_date.desc())
        .limit(page * 5)
    ).mappings().all()


@ban_router.post("/videos/{video_id}", status_code=status.HTTP_201_CREATED)
async def ban_video(video_id: str, db: db_dependency, current_user: CurrentUser):
    if current_user.role != models.UserRole.ADMIN:
        raise not_authorized_exception

    query = db.execute(
        select(models.Video, models.BannedVideo)
        .outerjoin(models.BannedVideo, models.BannedVideo.video_id == models.Video.video_id)
        .where(models.Video.video_id == video_id)
    ).first()

    video, banned_video = query

    if banned_video:
        raise HTTPException(
            status_code=status.HTTP_204_NO_CONTENT,
            detail="Already exists."
        )

    db.add(models.BannedVideo(
        video_id = video.video_id,
        channel_id = video.channel_id
    ))
    db.commit()
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload, joinedload
from typing import List

from app.db import db_dependency
from app.auth.auth import CurrentUser, not_authorized_exception
from app.models import models
from app.schema.responses import BannedChannelsResponse

ban_router = APIRouter(prefix="/api/ban", tags=["banned"])
security = HTTPBearer()

@ban_router.get("/channels", response_model=List[BannedChannelsResponse])
def get_banned_channels(db: db_dependency, offset: int = 1):
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
        .limit(5)
        .offset(5 * offset)
    ).mappings().all()


@ban_router.post("/channels")
async def ban_video(db: db_dependency, current_user: CurrentUser, credentials: HTTPAuthorizationCredentials = Depends(security)):
    if current_user.role != models.UserRole.ADMIN:
        raise not_authorized_exception
    
    return
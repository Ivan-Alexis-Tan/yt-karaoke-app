from fastapi import APIRouter, HTTPException
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from starlette import status
import math
from typing import Literal
from datetime import datetime

from app.models import models
from app.db import db_dependency
from app.auth.auth import CurrentUser, not_authorized_exception
from app.schema.ban_request_res import BanRequestResponse

ban_requests = APIRouter(prefix="/api/ban_requests", tags=["ban_requests"])

# response_model=list[BanRequestResponse]
@ban_requests.get("", status_code=status.HTTP_200_OK, response_model=list[BanRequestResponse])
def get_ban_requests(
    db: db_dependency, 
    page: int = 1, 
    date_order: Literal["recent", "old"] = "recent",
    req_status: models.BanRequestStatus | None = None
):
    if page < 1:
        page = 1

    total_rows = db.execute(
        select(func.count(models.BanRequest.video_id))
    ).scalar()

    total_pages = math.ceil(total_rows / 5)
    limit = 5 * page

    if page > total_pages:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Exceeded from maximum page."
        )

    if date_order == "recent":
        order_date_by = models.BanRequest.date.desc()
    if date_order == "old":
        order_date_by = models.BanRequest.date.asc()
    
    query = (
        select(models.BanRequest)
        .options(
            selectinload(models.BanRequest.video)
                .joinedload(models.Video.channel),
            selectinload(models.BanRequest.requested_user),
        )
        .order_by(order_date_by)
        .limit(limit)
    )

    if req_status != None:
        query = query.where(models.BanRequest.status == req_status)

    return db.execute(query).scalars().all()


@ban_requests.post("/{video_id}", status_code=status.HTTP_201_CREATED)
def request_ban_video(video_id: str, db: db_dependency, current_user: CurrentUser):
    # Check if banned =====================================
    is_banned = db.execute(
        select(models.BanRequest)
        .where(models.BanRequest.video_id == video_id)
    ).scalars().first()

    if is_banned:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Already banned"
        )

    # Check if been requested already =====================================
    been_requested = db.execute(
        select(models.BanRequest)
        .where(
            models.BanRequest.video_id == video_id,
            models.BanRequest.requested_by == current_user.id
        )
    ).scalars().first()

    if been_requested:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Already banned"
        )

    print(f"{is_banned = } | {been_requested = }")

    ban_request = models.BanRequest(
        video_id = video_id,
        requested_by = current_user.id
    )

    db.add(ban_request)
    db.commit()


@ban_requests.patch("/approve/{id}", status_code=status.HTTP_204_NO_CONTENT)
def approve_ban_request(id: str, db: db_dependency, current_user: CurrentUser):
    if current_user.role.value != "admin":
        raise not_authorized_exception

    now = datetime.utcnow()
    query = db.get(models.BanRequest, id)

    # Add to Banned Videos table
    db.add(models.BannedVideo(
        video_id = query.video_id,
        channel_id = query.video.channel_id,
        request_id = query.id
    ))

    # Update rows
    query.status = models.BanRequestStatus.APPROVED
    query.reviewed_at = now
    query.reviewed_by = current_user.id

    db.commit()


@ban_requests.patch("/reject/{id}", status_code=status.HTTP_204_NO_CONTENT)
def reject_ban_request(id: str, db: db_dependency, current_user: CurrentUser):
    if current_user.role.value != "admin":
        raise not_authorized_exception
    
    now = datetime.utcnow()
    query = db.get(models.BanRequest, id)

    query.status = models.BanRequestStatus.REJECTED
    query.reviewed_at = now
    query.reviewed_by = current_user.id

    db.commit()
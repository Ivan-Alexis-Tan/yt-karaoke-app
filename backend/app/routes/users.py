from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from starlette import status

from app.db import db_dependency
from app.auth import auth
from app.schema.responses import CurrentUserResponse

user_router = APIRouter(prefix="/api/users", tags=["users"])
security = HTTPBearer()

@user_router.get("", response_model=CurrentUserResponse, status_code=status.HTTP_200_OK)
async def current_user(current_user: auth.CurrentUser):
    return current_user
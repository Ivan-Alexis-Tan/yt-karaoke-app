from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from starlette import status

from app.db import db_dependency
from app.auth import auth

user_router = APIRouter(prefix="/api/users", tags=["users"])
security = HTTPBearer()

@user_router.get("", status_code=status.HTTP_200_OK)
async def current_user(db: db_dependency, credentials: HTTPAuthorizationCredentials = Depends(security)):
    return auth.current_user(credentials, db)
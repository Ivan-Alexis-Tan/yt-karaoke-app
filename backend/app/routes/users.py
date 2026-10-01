from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import jwt
from starlette import status

from app.core import config
from app.db import db_dependency
from app.models import models
from app.type import auth as auth_type

user_router = APIRouter(prefix="/api/users", tags=["users"])
security = HTTPBearer()

@user_router.post("", status_code=status.HTTP_201_CREATED)
async def create_user(db: db_dependency, credentials: HTTPAuthorizationCredentials = Depends(security),):
    # Decode JWT token =========================================
    token = credentials.credentials

    try:
        payload: auth_type.CredentialToken = jwt.decode(
            jwt=token,
            key=config.SECRET_KEY,
            algorithms=["HS256"],
        )

    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized."
        )

    # Creating User =========================================
    exists = db.query(models.User).filter(models.User.id == payload["sub"]).first()

    if exists:
        exists.email = payload["email"]
        exists.name = payload["name"]
        exists.picture = payload["picture"]

        db.commit()

        raise HTTPException(
            status_code=status.HTTP_204_NO_CONTENT,
            detail="Already exists"
        )

    db.add(models.User(
        sub_id = payload["sub"],
        email = payload["email"],
        name = payload["name"],
        picture = payload["picture"],
        role = models.UserRole.USER
    ))
    db.commit()
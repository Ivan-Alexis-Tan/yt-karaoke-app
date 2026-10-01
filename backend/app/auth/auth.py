from fastapi import HTTPException, Depends
from fastapi.security import HTTPAuthorizationCredentials
from starlette import status
import jwt
from typing import Annotated

from app.db import db_dependency
from app.type import auth as auth_type
from app.core import config
from app.models import models

not_authorized_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Unauthorized."
)

def decode_token(credentials: HTTPAuthorizationCredentials):
    token = credentials.credentials
    
    try:
        payload: auth_type.CredentialToken = jwt.decode(
            jwt=token,
            key=config.SECRET_KEY,
            algorithms=["HS256"],
            issuer="yt-karaoke-tvan-front",
            audience="yt-karaoke-tvan-back",
        )

    except jwt.InvalidTokenError:
        raise not_authorized_exception
    
    return payload


def current_user(credentials: HTTPAuthorizationCredentials, db: db_dependency):
    # Decode JWT token
    payload = decode_token(credentials)

    # Checking or Creating User =========================================
    exists = db.query(models.User).filter(
        models.User.provider == payload.get("provider"),
        models.User.auth_id == payload.get("sub")
    ).first()


    if exists:
        exists.email = payload.get("email")
        exists.name = payload.get("name")
        exists.picture = payload.get("picture")
        db.commit()

        return exists

    new_user = models.User(
        auth_id = payload.get("sub"),
        provider = payload.get("provider"),
        email = payload.get("email"),
        name = payload.get("name"),
        picture = payload.get("picture"),
        role = models.UserRole.USER
    )

    db.add(new_user)
    db.commit()

    return new_user


CurrentUser = Annotated[models.User, Depends(current_user)]
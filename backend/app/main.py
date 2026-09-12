from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

# Routers
from app.routes import yt_api, videos

from app.db import SessionLocal
from app.cache.cache import cache

app = FastAPI()

router = APIRouter(prefix="/api/test", tags=["test"])

@router.get("/users")
def get_users():
    def api_data():
        print("Fetched data from database")
        query = SessionLocal().execute(text('SELECT * FROM users'))
        return query.mappings().fetchall()

    # test = cache["users"]["data"]
    # if len(test) >= 1:
    #     keys = test[0].keys()
    #     print(f"{keys = }")

    # return cache_users(api_fn=api_data)


@router.get("/cache")
def check_cache():
    return cache


app.include_router(router)
app.include_router(yt_api.yt_router)
app.include_router(videos.videos_router)

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)
from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

# Routers
from app.routes import yt_api, videos

app = FastAPI()

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
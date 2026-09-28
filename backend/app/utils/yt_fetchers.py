import httpx

from app.type.yt_video_response import YTVideoListResponse
from app.type.yt_search_response import YTSearchListResponse

from app.core import config

async def req_yt_video(id: str | list[str], params: dict = {}) -> YTVideoListResponse:
    params = {
        "id": id if isinstance(id, str) else ",".join(id),
        "part": "snippet,contentDetails,statistics",
        "key": config.API_KEY,
        **params
    }

    async with httpx.AsyncClient() as client:
        print(">> (req_yt_video): Called the YT `video.list` endpoint")

        response = await client.get(
            url=f"{config.YOUTUBE_URL}/videos",
            params=params
        )
        response.raise_for_status()
        return response.json()


async def req_yt_search(query: str, max_results: int = 20) -> YTSearchListResponse:
    lowered = query.lower()

    params = {
        "part": "snippet",
        "q": f"{lowered} karaoke",
        "type": "video",
        "maxResults": max_results,
        "key": config.API_KEY,
    }

    async with httpx.AsyncClient() as client:
        print('>> (req_yt_search): Called the YT `search.list` API')
        response = await client.get(
            url=f"{config.YOUTUBE_URL}/search",
            params=params
        )
        response.raise_for_status()
        return response.json()
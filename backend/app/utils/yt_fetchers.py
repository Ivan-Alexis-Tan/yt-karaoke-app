import httpx

from app.core import config

async def req_yt_video(id: str | list, params: dict = {}):
    params = {
        "id": id if isinstance(id, str) else ",".join(id),
        "part": "snippet,contentDetails",
        "key": config.API_KEY,
        **params
    }

    async with httpx.AsyncClient() as client:
        print(">> Called the YT `video.list` endpoint")

        response = await client.get(
            url=f"{config.YOUTUBE_URL}/videos",
            params=params
        )
        response.raise_for_status()
        return response.json()
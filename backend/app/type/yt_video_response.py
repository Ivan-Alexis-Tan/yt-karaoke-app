from typing import TypedDict

from app.type.yt_search_response import ThumbnailSnippet

class VideoStatistics(TypedDict):
    viewCount: str
    likeCount: str | None
    favoriteCount: str | None
    commentCount: str | None


class VideoContentDetails(TypedDict):
    duration: str
    definition: str


class YTVideoResultSnippet(TypedDict):
    publishedAt: str
    channelId: str
    title: str
    thumbnails: ThumbnailSnippet
    channelTitle: str
    tags: list[str]
    categoryId: str
    publishTime: str


class YtVideoResult(TypedDict):
    id: str
    snippet: YTVideoResultSnippet
    contentDetails: VideoContentDetails
    statistics: VideoStatistics


class YTVideoListResponse(TypedDict):
    items: list[YtVideoResult]
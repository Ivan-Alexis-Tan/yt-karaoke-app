from typing import TypedDict

class YtThumbnailDict(TypedDict):
    url: str
    width: int
    height: int


class YtThumbnailDict(TypedDict):
    url: str
    width: int
    height: int


class ThumbnailSnippet(TypedDict):
    default: YtThumbnailDict
    medium: YtThumbnailDict | None
    standard: YtThumbnailDict | None
    high: YtThumbnailDict | None


class SearchResultID(TypedDict):
    kind: str
    videoId: str


class ThumbnailSnippet(TypedDict):
    default: YtThumbnailDict
    medium: YtThumbnailDict | None
    standard: YtThumbnailDict | None
    high: YtThumbnailDict | None


class SearchResultID(TypedDict):
    kind: str
    videoId: str


class PageInfo(TypedDict):
    totalResults: int
    resultsPerPage: int


class YTSearchResultSnippet(TypedDict):
    publishedAt: str
    channelId: str
    title: str
    thumbnails: ThumbnailSnippet
    channelTitle: str
    publishTime: str


class YtSearchResult(TypedDict):
    id: SearchResultID
    snippet: YTSearchResultSnippet


class YTSearchListResponse(TypedDict):
    regionCode: str
    pageInfo: PageInfo
    items: list[YtSearchResult]
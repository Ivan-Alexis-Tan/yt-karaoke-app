from app.type.parsed_YtApi import ParsedYtSearch, ParsedYtVideo
from app.type.yt_search_response import YTSearchListResponse
from app.type.yt_video_response import YTVideoListResponse

from app.utils.helpers import duration_to_seconds

def parse_yt_search(data: YTSearchListResponse) -> list[ParsedYtSearch]:
    """Parsing yt search response API"""
    
    parsed = []
    items = data["items"]

    for idx, item in enumerate(items, start=1):
        snippet = item["snippet"]
        thumbnail = snippet["thumbnails"]["medium"]

        data: ParsedYtSearch = {
            "position": idx,
            "video_id": item["id"]["videoId"],
            "video_title": snippet["title"],
            "channel_id": snippet["channelId"],
            "channel_title": snippet["channelTitle"],
            "thumbnail_url": thumbnail["url"],
            "thumbnail_width": thumbnail["width"],
            "thumbnail_height": thumbnail["height"],
        }

        parsed.append(data)

    return parsed


def parse_yt_video_list(video_list: YTVideoListResponse) -> list[ParsedYtVideo]:
    """Parsing yt list response API"""
    
    parsed_list = []

    for video in video_list["items"]:
        snippet = video["snippet"]

        thumbnail_keys = snippet["thumbnails"].keys()

        # Thumbnail key guard
        if "standard" in thumbnail_keys:
            thumbnail = snippet["thumbnails"]["standard"]
        elif "high" in thumbnail_keys:
            thumbnail = snippet["thumbnails"]["high"]
        else:
            thumbnail = snippet["thumbnails"]["medium"]

        duration = video["contentDetails"]["duration"]
        statistics = video["statistics"]

        snippet_keys = snippet.keys()
        statistics_keys = statistics.keys()

        # Parsing and Appending YT video list response API
        parsed_list.append({
            "video_id": video["id"],
            "video_title": snippet["title"],
            "thumbnail_url": thumbnail["url"],
            "thumbnail_width": 640,
            "thumbnail_height": 480,
            "channel_id": snippet['channelId'],
            "channel_title": snippet["channelTitle"],
            "duration_sec": duration_to_seconds(duration),
            "tags": snippet["tags"] if "tags" in snippet_keys else [],
            "category_id": snippet["categoryId"] if "categoryId" in snippet_keys else None,
            "statistics": {
                "view_count": statistics["viewCount"] if "viewCount" in statistics_keys else None,
                "like_count": statistics["likeCount"] if "likeCount" in statistics_keys else None,
                "comment_count": statistics["commentCount"] if "commentCount" in statistics_keys else None,
            }
        })

    return parsed_list
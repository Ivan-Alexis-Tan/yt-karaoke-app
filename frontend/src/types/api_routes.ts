// Video Types
type VideoType = {
    position?: number
    video_id: string
    video_title: string
    channel_id: string
    channel_title: string
    thumbnail_url: string
    thumbnail_width?: number
    thumbnail_height?: number
    duration_sec?: number
}

type VideoListResponse = VideoType[]

// Banned Channels Types
type BannedChannels = {
    channel_id: VideoType["channel_id"]
    channel_title: VideoType["channel_title"]
    date: string
}

type BannedChannelsResponse = BannedChannels[]

// Banned Videos Types
type BannedVideos = {
    date: string
    video_id: VideoType["video_id"]
    video_title: VideoType["video_title"]
    channel_id: VideoType["channel_id"]
    channel_title: VideoType["channel_title"]
    thumbnail_url: VideoType["thumbnail_url"]
    duration_sec: VideoType["duration_sec"]
}
type BannedVideosResponse = BannedVideos[]
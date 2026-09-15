type VideoListResponse = {
    position: number
    video_id: string
    video_title: string
    channel_id: string
    channel_title: string
    thumbnail_url: string
    thumbnail_width: number
    thumbnail_height: number
    duration_sec?: number
}[]

type SearchMode = "local" | "online"
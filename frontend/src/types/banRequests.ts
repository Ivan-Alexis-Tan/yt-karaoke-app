type BanRequestStatus = "pending" | "approved" | "rejected"
type BanRequestUser = Omit<UserType, "provider" | "created_at" >

type BanRequestType = {
    id: string
    date: string
    video_id: VideoType["video_id"]
    reason: string | null
    status: BanRequestStatus
    requested_by: string
    requested_user: BanRequestUser
    video: (
        Pick<VideoType, "video_id" | "video_title" | "thumbnail_url" | "duration_sec">
        & { channel: Pick<VideoType, "channel_id" | "channel_title">}
    )
    reviewed_at: string | null
    reviewed_by: BanRequestUser | null
    reviewed_user: BanRequestUser | null
}

type BanRequestsResponse = BanRequestType[]

// Admin Search Params
type DateOrderSearchParam = "recent" | "old"
type ReqStatusSearchParam = BanRequestStatus | "all"
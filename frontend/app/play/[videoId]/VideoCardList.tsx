"use client";

import { use } from "react"
import PaginatedVideoCards from "@/src/components/PaginatedVideoCards";

type VideoCardListProps = { 
    videoList: Promise<VideoListResponse>,
    currentUser: Promise<CurrentUserResponse> | CurrentUserResponse | null
}

export default function VideoCardList({ videoList, currentUser }: VideoCardListProps) {
    const userSession = currentUser instanceof Promise ? use(currentUser) : currentUser
    return (
        <PaginatedVideoCards videoList={videoList} currentUser={userSession}
            className="player-video-karaoke [&_a.karaoke-video-card]:mx-5 lg:[&_div.karaoke-video-card]:mx-0 lg:[&_div.karaoke-video-card]:mr-5"   
        />
    )
}
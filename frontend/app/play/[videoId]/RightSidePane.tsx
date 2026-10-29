"use client";

// Next.js
import { Suspense } from "react";

// Types
import type { PaneKeys } from "./MainPlayer";

// Components
import VideoSearch from "./VideoSearch";
import VideoCardSkeleton from "@/src/components/skeletons/VideoCardSkeleton";
import VideoCardList from "./VideoCardList";

type RightSidePaneProps = {
    showPane: PaneKeys
    videoList: Promise<VideoListResponse>
    currentUser: UserType | Promise<UserType> | null
}

export default function RightSidePane({ showPane, videoList, currentUser }: RightSidePaneProps) {
    if (showPane === "songs") return (
        <div className="mx-5 lg:mx-0 lg:overflow-auto">
            <Suspense fallback={Array.from({ length: 10 }, (_, i) => (
                <VideoCardSkeleton key={i as number} 
                    className="player-video-karaoke mx-auto max-w-200 lg:max-w-" 
                />
            ))}>
                <VideoCardList videoList={videoList} currentUser={currentUser} />
            </Suspense>
        </div>
    )

    if (showPane === "search") return (
        <VideoSearch 
            currentUserPromise={currentUser} 
            className="min-w-0 mx-5 lg:mx-0 lg:pr-5"
        />
    )
}
"use client"

import { use, useState } from "react"

import KaraokeVideoCard from "@/src/components/KaraokeVideoCard"

type PaginatedVideoCardsProps = {
    videoList: Promise<VideoListResponse[]>
    currentUser: CurrentUserResponse | null
    arrange_videos?: "row" | "col"
    className?: string
}

export default function PaginatedVideoCards({ videoList, currentUser, arrange_videos = "row", className }: PaginatedVideoCardsProps) {
    const [openPages, setOpenPages] = useState(1)
    const randVidList = use(videoList)

    function addPage() {
        if (openPages < randVidList.length) setOpenPages(p => p + 1);
    }

    const paginated = randVidList.slice(0, openPages)
    
    return (
        <>
            <div className={`${className ?? ""}`}>
                {paginated.map(page => page.map(vid => (
                    <KaraokeVideoCard key={vid.video_id}
                        video_details={vid}
                        arrange={arrange_videos}
                        currentUser={currentUser}
                        className="mx-auto max-w-200 lg:max-w-"
                    />
                )))}
            </div>

            <div className="mx-auto py-2 flex justify-center">
                {openPages < randVidList.length
                    && <button className="w-60 hover:bg-foreground hover:text-background border rounded-2xl"
                        onClick={addPage}
                    >
                        View more
                    </button>
                }
            </div>
        </>
        
    )
}
"use client"

import KaraokeVideoCard from "@/src/components/KaraokeVideoCard"
import { useState } from "react"

type PaginatedVideoCardsProps = {
    videoList: VideoListResponse[]
    arrange_videos?: "row" | "col"
    className?: string
}

export default function PaginatedVideoCards({ videoList, arrange_videos = "row", className }: PaginatedVideoCardsProps) {
    const [openPages, setOpenPages] = useState(1)

    function addPage() {
        if (openPages < videoList.length) setOpenPages(p => p + 1);
    }

    const paginated = videoList.slice(0, openPages)
    
    return (
        <>
            <div className={`${className ?? ""}`}>
                {paginated.map(page => page.map(vid => (
                    <KaraokeVideoCard key={vid.video_id}
                        video_details={vid}
                        arrange={arrange_videos}
                        className="mx-auto max-w-200 lg:max-w-"
                    />
                )))}
            </div>

            <div className="mx-auto py-2 flex justify-center">
                {openPages < videoList.length
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
"use client"

import KaraokeVideoCard from "@/src/components/KaraokeVideoCard"
import { useState } from "react"

type ShowVideosProps = {
    videoList: VideoListResponse[]
    arrange_videos?: "row" | "col"
    className?: string
}

export default function ShowVideos({ videoList, arrange_videos = "row", className }: ShowVideosProps) {
    const [openPages, setOpenPages] = useState(1)

    function addPage() {
        if (openPages < videoList.length) setOpenPages(p => p + 1);
    }

    const paginated = videoList.slice(0, openPages)
    
    return (
        <>
            <div className={`${className ?? ""} player-video-karaoke`}>
                {paginated.map(page => page.map(vid => (
                    <KaraokeVideoCard key={vid.video_id}
                        video_id={vid.video_id}
                        video_title={vid.video_title}
                        channel_id={vid.channel_id}
                        channel_title={vid.channel_title}
                        thumbnail_url={vid.thumbnail_url}
                        thumbnail_width={vid.thumbnail_width}
                        thumbnail_height={vid.thumbnail_height}
                        duration_sec={vid.duration_sec as number}
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
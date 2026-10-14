"use client"

import { use, useEffect, useState } from "react"

import KaraokeVideoCard from "@/src/components/KaraokeVideoCard"
import CloseIcon from "../svgs/CloseIcon"

type PaginatedVideoCardsProps = {
    videoList: Promise<VideoListResponse[]>
    currentUser: CurrentUserResponse | null
    arrange_videos?: "row" | "col"
    className?: string
}

export default function PaginatedVideoCards({ videoList, currentUser, arrange_videos = "row", className }: PaginatedVideoCardsProps) {
    const randVidList = use(videoList)

    const [openPages, setOpenPages] = useState(1)
    const [flagBanRequest, setFlagBanRequest] = useState<boolean>(false)

    useEffect(() => {
        if (!flagBanRequest) return

        setTimeout(() => {
            setFlagBanRequest(false)
        }, 5000);
    }, [flagBanRequest])

    function showBanRequestSent() {
        setFlagBanRequest(true)
    }

    function addPage() {
        if (openPages < randVidList.length) setOpenPages(p => p + 1);
    }

    const paginated = randVidList.slice(0, openPages)
    
    return (
        <>
            {flagBanRequest
                && <div className="max-w-80 p-1 fixed bottom-3 left-0 z-(--z-popup-window) 
                    flex justify-between items-center 
                    border-y border-r border-foreground rounded-r-2xl text-background bg-green-400"
                >
                    <p>Ban request successfully sent.</p>

                    <button className="hover:[&_svg]:text-foreground"
                        onClick={_ => setFlagBanRequest(false)}
                    >
                        <CloseIcon className="w-7 h-7" />
                    </button>
                </div>
            }

            <div className={`${className ?? ""}`}>
                {paginated.map(page => page.map(vid => (
                    <KaraokeVideoCard key={vid.video_id}
                        video_details={vid}
                        arrange={arrange_videos}
                        currentUser={currentUser}
                        showBanRequestSentFn={showBanRequestSent}
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
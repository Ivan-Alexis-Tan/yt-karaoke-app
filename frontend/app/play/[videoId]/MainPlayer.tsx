"use client"

import { useState } from "react";
import KaraokePlayer from "./KaraokePlayer";
import Recommendations from "./Recommendations";
import QueueIcon from "@/src/svgs/QueueIcon";
import ShowVideos from "@/app/ShowVideos";

type MainPlayerProps = {
    videoId: string
    videoList: VideoListResponse[]
    className?: string 
}

export default function MainPlayer({ videoId, videoList, className }: MainPlayerProps) {
    const [showReccom, setShowReccom] = useState(true)
    return (
        <div className={`${className ?? ""}`}>
            <div className="mb-5 gap-3 flex justify-end">
                <button onClick={_ => setShowReccom(p => !p)}>
                    Songs
                </button>

                <button>
                    <QueueIcon className="w-10 h-10" />
                </button>
            </div>

            <div className={`${showReccom && "gap-3 grid grid-cols-[2fr_1fr]"}`}>
                <KaraokePlayer videoId={videoId} />

                {showReccom
                    && <div className="h-135 overflow-auto">
                        <ShowVideos 
                            
                            videoList={videoList} 
                        />
                    </div>
                }
            </div>

            
        </div>
    )
}
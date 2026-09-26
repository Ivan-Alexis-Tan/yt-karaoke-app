"use client";

import Link from "next/link"
import Image from "next/image"

import { formatMinutesSeconds } from "../utils/helpers"
import { bannedChannels } from "../appData"
import VideoCardOption from "./VideoCardOption";

export type KaraokeVideoCardType = {
    video_details: VideoListResponse[number]
    arrange?: "row" | "col"
    disableQueBtn?: boolean
    className?: string
}

export default function KaraokeVideoCard({
    video_details,
    arrange = "row",
    disableQueBtn = false,
    className,
}: KaraokeVideoCardType) {
    const duration = video_details.duration_sec ? formatMinutesSeconds(video_details.duration_sec) : ""

    return (
        <div className={`${className ?? ""} karaoke-video-card relative hover:bg-(--gry-700) hover:[&_div.card-button]:flex rounded-2xl transition-all`}>
            
            {/* Video card information */}
            <Link className={`
                    gap-3 p-2 grid items-center
                    ${bannedChannels.includes(video_details.channel_title) && "hidden"} 
                    ${arrange === "row" ? "grid-cols-2" : "grid-cols-1"}
                `}
                href={`/play/${video_details.video_id}`}
            >
                <div className="relative">
                    <Image className="w-full rounded-2xl" 
                        src={video_details.thumbnail_url} alt="video thumbnail" 
                        width={640} height={480} 
                    />

                    <div className="px-0.5 absolute bottom-3 right-3 bg-(--lucent-blk-clr)">
                        {duration}
                    </div>
                </div>

                <div className="m-1.5 gap-1 flex flex-col justify-center text-white *:text-ellipsis *:overflow-hidden">
                    <h3 className="text-xl font-bold">{video_details.video_title}</h3>
                    <p>{video_details.channel_title}</p>
                </div>
            </Link>

            {/* Options button */}
            {!disableQueBtn && <VideoCardOption video_details={video_details} />}

        </div>
    )
}
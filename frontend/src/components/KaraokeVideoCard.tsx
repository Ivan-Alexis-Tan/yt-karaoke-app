"use client";

import Link from "next/link"
import Image from "next/image"
import { useState } from "react";

import { formatMinutesSeconds } from "../utils/helpers"
import { bannedChannels } from "../appData"
import useSongQueue, { addSongQueueSelector } from "../utils/useSongQueue";

import AddToListIcon from "../svgs/AddToListIcon";
import SongAddedIcon from "../svgs/SongAddedIcon";

export type KaraokeVideoCardType = {
    video_id: string
    video_title: string
    channel_id: string
    channel_title: string
    thumbnail_url: string
    thumbnail_width: number
    thumbnail_height: number
    duration_sec: number
    arrange?: "row" | "col"
    disableQueBtn?: boolean
    className?: string
}

export default function KaraokeVideoCard({
    video_id,
    video_title,
    channel_id,
    channel_title,
    thumbnail_url,
    thumbnail_height,
    thumbnail_width,
    duration_sec,
    arrange = "row",
    disableQueBtn = false,
    className,
}: KaraokeVideoCardType) {
    const [songAdded, setSongAdded] = useState(false)
    const addSongQueue = useSongQueue(addSongQueueSelector)

    function addToQueue() {
        addSongQueue({
            video_id,
            video_title,
            channel_id,
            channel_title,
            thumbnail_url,
            thumbnail_height,
            thumbnail_width,
            duration_sec,
        })

        setSongAdded(true)

        setTimeout(() => {
            setSongAdded(false)
        }, 3000)
    }

    return (
        <div className={`${className ?? ""} karaoke-video-card relative hover:bg-(--gry-700) hover:[&_div.card-button]:flex rounded-2xl transition-all`}>
            
            {/* Video card information */}
            <Link className={`
                    gap-3 p-2 grid items-center
                    ${bannedChannels.includes(channel_title) && "hidden"} 
                    ${arrange === "row" ? "grid-cols-2" : "grid-cols-1"}
                `}
                href={`/play/${video_id}`}
            >
                <div className="relative">
                    <Image className="w-full rounded-2xl" 
                        src={thumbnail_url} alt="video thumbnail" 
                        width={640} height={480} 
                    />

                    <div className="px-0.5 absolute bottom-3 right-3 bg-(--lucent-blk-clr)">
                        {formatMinutesSeconds(duration_sec)}
                    </div>
                </div>

                <div className="m-1.5 gap-1 flex flex-col justify-center text-white">
                    <h3 className="text-xl font-bold">{video_title}</h3>
                    <p>{channel_title}</p>
                </div>
            </Link>

            {/* Options button */}
            {!disableQueBtn
                && <div className="card-button w-10 h-10 hidden absolute bottom-2 right-2 justify-center items-center hover:bg-(--lucent-blk-clr) rounded-full">
                    {songAdded
                        ? <SongAddedIcon className="w-7 h-7 text-green-400 font-bold" />
                        :<button onClick={_ => addToQueue()}>
                            <AddToListIcon className="w-7 h-7" />
                        </button>
                    }
                </div>
            }

        </div>
    )
}
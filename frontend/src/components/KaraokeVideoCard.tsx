"use client";

import Link from "next/link"
import Image from "next/image"
import { useState } from "react";

import { formatMinutesSeconds } from "../utils/helpers"
import { bannedChannels } from "../appData"
import useSongQueue, { addSongQueueSelector, songQueueSelector } from "../utils/useSongQueue";

import { QueueNotifType } from "../types/states";

import AddToListIcon from "../svgs/AddToListIcon";
import SongAddedIcon from "../svgs/SongAddedIcon";
import QueueAlertIcon from "../svgs/QueueAlertIcon";

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
    const [queueNotif, setQueueNotif] = useState<QueueNotifType>("none")

    const songQueue = useSongQueue(songQueueSelector)
    const addSongQueue = useSongQueue(addSongQueueSelector)

    function addToQueue() {
        const exists = songQueue.find(vid => vid.video_id === video_id)
        if (!exists) {
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

            setQueueNotif("added")
        }
        else setQueueNotif("error")
        

        setTimeout(() => {
            setQueueNotif("none")
        }, 3000)
    }

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
            {!disableQueBtn
                && <div className="card-button w-10 h-10 hidden absolute bottom-2 right-2 justify-center items-center hover:bg-(--lucent-blk-clr) rounded-full">
                    {queueNotif === "none"
                        ? <button onClick={_ => addToQueue()}>
                            <AddToListIcon className="w-7 h-7" />
                        </button>
                        :<>
                            {queueNotif === "added"
                                && <SongAddedIcon className="w-7 h-7 text-green-400 font-bold" />
                            }
                            
                            {queueNotif === "error"
                                && <QueueAlertIcon className="w-7 h-7 text-(--red-clr) font-bold" />
                            }
                        </>
                    }
                </div>
            }

        </div>
    )
}
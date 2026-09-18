import Link from "next/link";
import { useEffect, useState } from "react";

import NextSongIcon from "@/src/svgs/NextSongIcon";
import NoSongOnQueueIcon from "@/src/svgs/NoSongOnQueueIcon";

type NextSongControlProps = {
    songQueue: VideoListResponse
    deleteSongQueue: (video_id: string) => void
    className?: string
}

export default function NextSongControl({ songQueue, deleteSongQueue, className }: NextSongControlProps) {
    const [nextSong, setNextSong] = useState<VideoListResponse[number] | null>(null)

    useEffect(() => {
        if (songQueue.length === 0) {
            setNextSong(null)
            return
        }
        
        setNextSong(songQueue[0])

    }, [songQueue])
    
    if (nextSong !== null) return (
        <Link className={`${className ?? ""} next-song-container min-w-0 flex items-center`}
            href={`/play/${nextSong["video_id"]}`}
            onClick={_ => {
                deleteSongQueue(nextSong["video_id"])
            }}
            title={`Next song: ${nextSong["video_title"]}`}
        >
            <NextSongIcon className="next-song-btn w-7 h-7 shrink-0 border rounded" />

            <p className="next-song-title py-0.5 px-2 whitespace-nowrap text-ellipsis overflow-hidden"
                title={`${nextSong["video_title"]}`}
            >
                <span className="font-bold text-green-400">NEXT:</span> {nextSong["video_title"]}
            </p>
        </Link>
    );
    else return (
        <div className={`${className ?? ""} flex gap-1 items-center`}>
            <NoSongOnQueueIcon className="w-7 h-7 text-(--red-clr)" />
            <p>No song on queue</p>
        </div>
    )
}
"use client"

import { useState } from "react";

import useSongQueue, { songQueueSelector, deleteSongQueueSelector } from "@/src/utils/useSongQueue";

import KaraokePlayer from "./KaraokePlayer";
import ShowVideos from "@/app/ShowVideos";
import SongNoteIcon from "@/src/svgs/SongNoteIcon";
import SearchIcon from "@/src/svgs/SearchIcon";
import HideIcon from "@/src/svgs/HideIcon";
import NextSongControl from "./NextSongControl";
import VideoSearch from "./VideoSearch";

type MainPlayerProps = {
    videoId: string
    videoList: VideoListResponse[]
    className?: string 
}

type PaneKeys = "hide" | "songs" | "search"

export default function MainPlayer({ videoId, videoList, className }: MainPlayerProps) {
    const [showPane, setShowPane] = useState<PaneKeys>("songs")

    const songQueue = useSongQueue(songQueueSelector)
    const deleteSongQueue = useSongQueue(deleteSongQueueSelector)

    const RightPaneControls = ({ className }: { className?: string }) => {
        return (
            <div className={`${className ?? ""} [&>button]:flex [&>button]:gap-1 [&>button]:items-center [&>button]:hover:border-foreground [&>button]:transition-all`}>
                <button onClick={_ => setShowPane("search")}
                    className={`${showPane === "search" && "bg-foreground text-background"} px-1 border border-background rounded`}
                >
                    <SearchIcon className="w-7 h-7" />
                    <p>Search</p>
                </button>

                <button onClick={_ => setShowPane("songs")}
                    className={`${showPane === "songs" && "bg-foreground text-background"} px-1 border border-background rounded`}
                >
                    <SongNoteIcon className="w-7 h-7" />
                    <p>Songs</p>
                </button>

                <button onClick={_ => setShowPane("hide")}
                    className={`${showPane === "hide" && "bg-foreground text-background"} px-1 border border-background rounded hover:text-(--red-clr)`}
                >
                    <HideIcon className="w-7 h-7" />
                    <p>Hide</p>
                </button>
            </div>
        )
    }

    return (
        <div className={`${className ?? ""} 
            ${showPane !== "hide" && "gap-3 flex flex-col lg:grid lg:grid-cols-[2fr_1fr]"}`}
        >
            <div>
                <KaraokePlayer videoId={videoId} className="mb-5" />

                <div className="mx-5 gap-3 flex flex-col sm:flex-row justify-between">
                    <NextSongControl 
                        songQueue={songQueue}
                        deleteSongQueue={deleteSongQueue}
                        className="flex-1"
                    />

                    <RightPaneControls className="gap-3 flex justify-end" />
                </div>
            </div>

            {showPane === "songs"
                && <div className="mx-5 lg:mx-0 lg:overflow-auto">
                    <ShowVideos className="[&_a.karaoke-video-card]:mx-5 lg:[&_div.karaoke-video-card]:mx-0 lg:[&_div.karaoke-video-card]:mr-5"
                        videoList={videoList} 
                    />
                </div>
            }

            {showPane === "search"
                && <VideoSearch className="flex-1"/>
            }
        </div>
    )
}
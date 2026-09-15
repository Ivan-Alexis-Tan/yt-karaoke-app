"use client"

import { useEffect, useState } from "react";

import { getSongQueue } from "@/src/utils/queueFn";

import KaraokePlayer from "./KaraokePlayer";
import ShowVideos from "@/app/ShowVideos";
import SongNoteIcon from "@/src/svgs/SongNoteIcon";
import SearchIcon from "@/src/svgs/SearchIcon";
import HideIcon from "@/src/svgs/HideIcon";

type MainPlayerProps = {
    videoId: string
    videoList: VideoListResponse[]
    className?: string 
}

type PaneKeys = "none" | "songs" | "search"

export default function MainPlayer({ videoId, videoList, className }: MainPlayerProps) {
    const [showPane, setShowPane] = useState<PaneKeys>("songs")
    const [songQueue, setSongQueue] = useState(getSongQueue())

    useEffect(() => console.log(`showPane =`, showPane), [showPane])

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

                <button onClick={_ => setShowPane("none")}
                    className={`${showPane === "none" && "bg-foreground text-background"} px-1 border border-background rounded hover:text-(--red-clr)`}
                >
                    <HideIcon className="w-7 h-7" />
                    <p>Hide</p>
                </button>
            </div>
        )
    }

    return (
        <div className={`${className ?? ""} ${showPane !== "none" && "gap-3 grid grid-cols-1 lg:grid-cols-[2fr_1fr]"}`}>
            <div>
                <KaraokePlayer videoId={videoId} />

                <RightPaneControls className="mx-5 mb-5 gap-3 flex justify-end" />
            </div>

            {showPane === "songs"
                && <div className="overflow-auto">
                    <ShowVideos className="[&_a.karaoke-video-card]:mx-5 lg:[&_div.karaoke-video-card]:mx-0 lg:[&_div.karaoke-video-card]:mr-5"
                        videoList={videoList} 
                    />
                </div>
            }

            {showPane === "search"
                && <div>

                </div>
            }
        </div>
    )
}
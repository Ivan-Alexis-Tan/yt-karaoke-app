"use client"

import { Suspense, useEffect, useState } from "react";

import useSongQueue, { songQueueSelector, deleteSongQueueSelector } from "@/src/utils/useSongQueue";
import useCurrentVideo, { addCurrentSongSelector } from "@/src/utils/useCurrentVideo";

import KaraokePlayer from "./KaraokePlayer";
import SongNoteIcon from "@/src/svgs/SongNoteIcon";
import SearchIcon from "@/src/svgs/SearchIcon";
import HideIcon from "@/src/svgs/HideIcon";
import NextSongControl from "./NextSongControl";
import VideoSearch from "./VideoSearch";
import PaginatedVideoCards from "@/src/components/PaginatedVideoCards";
import VideoCardSkeleton from "@/src/components/skeletons/VideoCardSkeleton";

type MainPlayerProps = {
    videoId: string
    videoList: VideoListResponse[]
    className?: string 
}

type PaneKeys = "hide" | "songs" | "search"

export default function MainPlayer({ videoId, videoList, className }: MainPlayerProps) {
    const [showPane, setShowPane] = useState<PaneKeys>("songs")
    const currentVideo = useCurrentVideo(addCurrentSongSelector)

    const songQueue = useSongQueue(songQueueSelector)
    const deleteSongQueue = useSongQueue(deleteSongQueueSelector)

    useEffect(() => {
        currentVideo(videoId)
    }, [])

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
            ${showPane !== "hide" && "gap-3 grid lg:grid-cols-[2fr_1fr]"}`}
        >
            {/* Left Side Pane */}
            <div className="min-w-0">
                <KaraokePlayer videoId={videoId} className="mb-5" />

                <div className="mx-5 gap-3 flex flex-col sm:flex-row justify-between">
                    <NextSongControl 
                        songQueue={songQueue}
                        deleteSongQueue={deleteSongQueue}
                    />

                    <RightPaneControls className="gap-3 flex justify-end" />
                </div>
            </div>

            {/* Right Side Pane */}
            <>
                {showPane === "songs"
                    && <div className="mx-5 lg:mx-0 lg:overflow-auto">
                        <Suspense fallback={Array.from({ length: 10 }, i => (
                            <VideoCardSkeleton key={i as number} 
                                className="player-video-karaoke mx-auto max-w-200 lg:max-w-" 
                            />
                        ))}>
                            <PaginatedVideoCards videoList={videoList}
                                className="player-video-karaoke [&_a.karaoke-video-card]:mx-5 lg:[&_div.karaoke-video-card]:mx-0 lg:[&_div.karaoke-video-card]:mr-5"   
                            />
                        </Suspense>
                    </div>
                }

                {showPane === "search"
                    && <VideoSearch className="min-w-0 mx-5 lg:mx-0 lg:pr-5"/>
                }
            </>
        </div>
    )
}
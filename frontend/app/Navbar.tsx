"use client"

// Next.js
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Custom useHooks and their Components
import useSongQueue, { songQueueSelector } from "@/src/utils/useSongQueue";
import useCurrentVideo, { currentSongSelector } from "@/src/utils/useCurrentVideo";

// Components
import YoutubeIcon from "@/src/svgs/YoutubeIcon";
import KaraokeMicIcon from "@/src/svgs/KaraokeMicIcon";
import QueueIcon from "@/src/svgs/QueueIcon";
import SongQueue from "@/src/components/SongQueue";
import NavbarSearchBar from "./NavbarSearchBar";
import PlayIcon from "@/src/svgs/PlayIcon";


export default function Navbar({ className, currentUser }: { className?: string, currentUser: CurrentUserResponse }) {
    const [showQueue, setShowQueue] = useState<boolean>(false)
    const path = usePathname()
    const currentSong = useCurrentVideo(currentSongSelector)
    const songQueue = useSongQueue(songQueueSelector)

    useEffect(() => {
        setShowQueue(false)
    }, [path])

    const currentPage = path.split("/")[1]
    const currentSongTitle = currentSong && ("video_title" in currentSong ? currentSong.video_title : "")
     
    return (
        <nav className={`${className ?? ""}`}>
            <div className="gap-3 sm:gap-10 flex justify-between items-center">
                {/* Brand Name and Home Link */}
                <Link href={"/"}
                    className="text-(--red-clr) min-w-11 min-h-11 hover:text-foreground"
                    title="Youtube Karaoke App"
                >
                    <h2 className="flex flex-col md:flex-row gap-1 justify-center items-center text-2xl font-bold">
                        <div className="-mb-4 md:mb-0 w-10.5 h-10.5 relative">
                            <YoutubeIcon className="w-10 h-10" />
                            <KaraokeMicIcon className="w-6 h-6 absolute bottom-1 right-0" />
                        </div>
                        <p className="hidden sm:block text-center">Karaoke App</p>
                    </h2>
                </Link>

                {/* Search Bar in Navbar */}
                {currentPage === "play"
                    ? <div className="min-w-0 flex-1 flex justify-center items-center"
                        title={currentSongTitle ?? ""}
                        onClick={_ => window.scrollTo({ top: 0, behavior: "smooth" })}
                    >
                        <div>
                            <PlayIcon className="w-10 h-10 text-(--red-clr)" />
                        </div>
                        <h3 className="text-xl font-bold whitespace-nowrap text-ellipsis overflow-hidden">
                            {currentSongTitle}
                        </h3>
                    </div>
                    : <NavbarSearchBar />
                }

                {/* User Tools */}
                <div className="max-w-40 min-w-0 flex gap-3 items-center justify-between">
                    {/* Song Queue Button */}
                    <div className="relative mr-2 flex justify-center items-center">
                        <button onClick={_ => setShowQueue(p => !p)}
                            title={`${showQueue ? "Close" : "Open"} song queue`}
                            className={`${showQueue && "bg-(--red-clr) border-(--red-clr)"} px-1 border rounded-xl`}
                        >
                            <QueueIcon className="w-10 h-10" />
                        </button>

                        <div className="absolute top-[-7] right-[-7] w-5 h-5 flex justify-center items-center text-black bg-green-400 rounded-full">
                            {songQueue.length}
                        </div>
                    </div>

                    {/* Song Queue UI */}
                    {showQueue 
                        && <>
                            <div className="w-full h-full fixed top-18 left-0"
                                onClick={_ => setShowQueue(false)}
                            />
                            <SongQueue 
                                currentPath={currentPage}
                                currentUser={currentUser}
                                closeFn={setShowQueue} 
                            />
                        </>
                    }
                </div>
            </div>
        </nav>
    )
}
"use client"

// Next.js imports
import { Suspense, useEffect, useState, use } from "react";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";

// useHooks, Utils, and other helper functions
import useSongQueue, { songQueueSelector, deleteSongQueueSelector } from "@/src/utils/useSongQueue";
import useCurrentVideo, { addCurrentSongSelector } from "@/src/utils/useCurrentVideo";
import { usePopupWindow } from "@/src/components/PopupWindow";

// Components
import KaraokePlayer from "./KaraokePlayer";
import SongNoteIcon from "@/src/svgs/SongNoteIcon";
import SearchIcon from "@/src/svgs/SearchIcon";
import HideIcon from "@/src/svgs/HideIcon";
import NextSongControl from "./NextSongControl";
import BanIcon from "@/src/svgs/BanIcon";
import RequestBanIcon from "@/src/svgs/RequestBanIcon";
import RightSidePane from "./RightSidePane";
import NotifPopup, { useNotify } from "@/src/components/NotifPopup";
import BanNotifPopup from "./BanNotifPopup";

export type MainPlayerProps = {
    videoId: string
    videoList: Promise<VideoListResponse>
    currentUser: Promise<CurrentUserResponse> | null
    className?: string 
}

export type PaneKeys = "hide" | "songs" | "search" | "ban"

export default function MainPlayer({ videoId, videoList, currentUser, className }: MainPlayerProps) {
    const { data: session } = useSession()
    const [showPane, setShowPane] = useState<PaneKeys>("songs")
    const { showPopup, openPopup, closePopup, popupWindowStates } = usePopupWindow({ banPopup: false })
    const { notifStates, showNotif, notifPopupTools } = useNotify({ 
        banSuccess: false,
        requestSuccess: false,
    })

    const currentVideo = useCurrentVideo(addCurrentSongSelector)
    const songQueue = useSongQueue(songQueueSelector)
    const deleteSongQueue = useSongQueue(deleteSongQueueSelector)

    useEffect(() => {
        currentVideo(videoId)
    }, [])

    const RightPaneControls = ({ className }: { className?: string }) => {
        return (
            <div className={`${className ?? ""} [&>button]:flex [&>button]:gap-1 [&>button]:items-center [&>button]:hover:border-foreground [&>button]:transition-all`}>
                <BanVideoBtn currentUser={currentUser} openPopupFn={_ => openPopup("banPopup")} />
                
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
                    <NextSongControl className="flex-1"
                        songQueue={songQueue}
                        deleteSongQueue={deleteSongQueue}
                    />

                    <RightPaneControls className="lg:gap-3 flex justify-evenly overflow-auto" />
                </div>
            </div>

            {/* Right Side Pane */}
            <RightSidePane showPane={showPane} videoList={videoList} currentUser={currentUser} />

            {/* Ban Request Popup Window */}
            {showPopup.banPopup
                && <BanNotifPopup currentUserPromise={currentUser} 
                    popupWindowStates={popupWindowStates} 
                    closePopupFn={closePopup}
                    showNotifFn={showNotif}
                    videoId={videoId}
                    session={session as Session}
                />
            }

            {/* Notification Windows */}
            {notifStates.banSuccess
                && <NotifPopup notifId="banSuccess" message="Banned Successfully" notifPopupTools={notifPopupTools} />
            }

            {notifStates.requestSuccess
                && <NotifPopup notifId="requestSuccess" message="Ban Request Sent" notifPopupTools={notifPopupTools} />
            }
        </div>
    )
}

const BanVideoBtn = ({ currentUser, openPopupFn }: {
    currentUser: MainPlayerProps["currentUser"]
    openPopupFn: (windowId: string) => any
}) => {
    const user = currentUser ? use(currentUser) : currentUser
    return (
        <Suspense fallback={
            <button disabled
                className={`px-1 text-(--gray-clr) hover:cursor-default!`}
            >
                <BanIcon className="w-7 h-7" />
                Ban
            </button>
        }>
            {user
                && <button
                    className={`px-1 border border-background rounded hover:text-(--red-clr) whitespace-nowrap`}
                    title={user?.role === "admin" ? "Ban channel" : "Send ban request"}
                    onClick={() => openPopupFn("banPopup")}
                >
                    {user?.role === "admin"
                        ? <BanIcon className="w-7 h-7" />
                        : <RequestBanIcon className="w-7 h-7" />
                    }
                    Ban
                </button>
            }
        </Suspense>
    )
}
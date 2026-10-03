"use client";

// Next.js
import { Dispatch, SetStateAction, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Custom useHook
import useSongQueue, { 
    songQueueSelector, 
    deleteSongQueueSelector, 
    emptySongQueueSelector 
} from "../utils/useSongQueue";

// Components
import { LogoutComponent } from "./LogoutComponent";
import KaraokeVideoCard from "./KaraokeVideoCard";
import CloseIcon from "../svgs/CloseIcon";
import EmptyQueueIcon from "../svgs/EmptyQueueIcon";
import DeleteIcon from "../svgs/DeleteIcon";
import NoSongOnQueueIcon from "../svgs/NoSongOnQueueIcon";

type SongQueueParams = { 
    closeFn: Dispatch<SetStateAction<boolean>>
    currentPath: string
    currentUser: CurrentUserResponse
    className?: string
}
export default function SongQueue({ closeFn, currentPath, currentUser, className }: SongQueueParams) {
    const [popupWindow, setPopupWindow] = useState(false)
    
    const songQueue = useSongQueue(songQueueSelector)
    const deleteSongQueue = useSongQueue(deleteSongQueueSelector)
    const emptySongQueue = useSongQueue(emptySongQueueSelector)

    return (
        // Popup Window of Song Queue on Navbar
        <div className={`${className ?? ""} 
                max-w-100 sm:max-w-150 w-full sm:w-[60%] 
                h-[calc(100vh-4.2rem)] sm:h-[calc(100vh-5.2rem)] md:h-[calc(100vh-4.2rem)] 
                fixed top-17 sm:top-21 md:top-17 right-0 
                flex flex-col rounded-l-xl bg-(--gray-clr) overflow-auto
        `}>
            {/* Top buttons of the Song Queue Window */}
            <div className="gap-3 p-1 px-2 sticky top-0 right-0 z-(--z-pop-sidebar) bg-(--gray-clr) flex justify-between items-center">
                <div className="flex items-center">
                    {!currentUser
                        && <Link href={"/login"}>
                            Sign in
                        </Link>
                    }

                    {currentUser
                        && <div className="gap-4 flex">
                            <Link href={"/profile"}
                                title={currentUser.name}
                            >
                                <Image 
                                    src={currentUser.picture}
                                    width={30}
                                    height={30}
                                    alt={`${currentUser.name}'s profile picture`}
                                    className="rounded-full"
                                />
                            </Link>
                            <LogoutComponent />
                        </div>
                    }
                </div>
                
                <div className="gap-2 flex items-center">
                    {songQueue.length >= 1
                        && <button onClick={_ => setPopupWindow(true)} className="hover:text-(--red-clr)">
                            <EmptyQueueIcon className="w-7 h-7" />
                        </button>
                    }
                    <button className="hover:text-(--red-clr)"
                        onClick={_ => closeFn(false)}
                    >
                        <CloseIcon className="w-7 h-7" />
                    </button>
                </div>
            </div>

            {/* Song Queue List Display */}
            {songQueue.length >= 1
                ? <div className="relative">
                    {songQueue.map(vid => (
                        <div key={vid.video_id} 
                            className="mx-3 relative hover:bg-(--light-gray-clr) lg:hover:[&>button]:flex rounded-2xl"
                        >
                            {/* Song on queue video card */}
                            <div onClick={_ => deleteSongQueue(vid.video_id)}>
                                <KaraokeVideoCard 
                                    video_details={vid}
                                    currentUser={currentUser}
                                    disableQueBtn={true}
                                    className="[&_a]:grid-cols-1! sm:[&_a]:grid-cols-2!"
                                />
                            </div>
                            
                            {/* Delete from song queue button */}
                            <div className="flex lg:hidden absolute bottom-2 right-2
                                hover:[&_button.more-option-btn]:bg-(--lucent-blk-clr)"
                            >
                                <button className=""
                                    onClick={_ => {
                                        deleteSongQueue(vid.video_id)
                                    }}
                                    title="Remove song from queue"
                                >
                                    <DeleteIcon className="w-7 h-7" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                :<div className="w-full h-full relative flex justify-center items-center">
                    {/* No song on queue Display */}
                    <div className="flex flex-col justify-center items-center">
                        <NoSongOnQueueIcon className="w-15 h-15" />
                        <p className="text-xl">No song currently on queue</p>
                    </div>
                </div>
            }

            {/* Confirm Delete Popup Window of Song Queue */}
            {popupWindow && <ConfirmDeletePopup popupFn={setPopupWindow} emptySongQueue={emptySongQueue} />}
        </div>
    )
}

const ConfirmDeletePopup = ({ popupFn, emptySongQueue }: {
    popupFn: Dispatch<SetStateAction<boolean>>
    emptySongQueue: () => void
}) => {
    return (
        <div className="w-full h-full fixed top-18 left-0 flex justify-center items-center bg-[hsla(0,100%,100%,0.2)]">
            <div className="w-70 md:w-80 h-70 flex flex-col justify-evenly items-center rounded-2xl bg-background">
                <h2 className="mx-5 text-center text-2xl font-bold">Delete all song queue?</h2>
                
                <div className="w-full flex justify-evenly [&>button]:border [&>button]:p-2 [&>button]:rounded-2xl">
                    <button className="hover:bg-(--red-clr) hover:border-(--red-clr)"
                        onClick={_ => {
                            emptySongQueue()
                            popupFn(false)
                        }}
                    >
                        Delete
                    </button>

                    <button onClick={_ => popupFn(false)} className="hover:bg-foreground hover:text-background">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}
"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";

import KaraokeVideoCard from "./KaraokeVideoCard";
import CloseIcon from "../svgs/CloseIcon";
import EmptyQueueIcon from "../svgs/EmptyQueueIcon";
import DeleteIcon from "../svgs/DeleteIcon";
import useSongQueue, { 
    songQueueSelector, 
    deleteSongQueueSelector, 
    emptySongQueueSelector 
} from "../utils/useSongQueue";
import NoSongOnQueueIcon from "../svgs/NoSongOnQueueIcon";

type SongQueueParams = { 
    closeFn: Dispatch<SetStateAction<boolean>>
    className?: string 
}
export default function SongQueue({ closeFn, className }: SongQueueParams) {
    const [popupWindow, setPopupWindow] = useState(false)
    
    const songQueue = useSongQueue(songQueueSelector)
    const deleteSongQueue = useSongQueue(deleteSongQueueSelector)
    const emptySongQueue = useSongQueue(emptySongQueueSelector)

    return (
        // Popup Window of Song Queue on Navbar
        <div className={`${className ?? ""} max-w-150 w-[60%] h-[calc(100vh-4.5rem)] fixed right-0 top-18 rounded-l-xl bg-(--gray-clr) overflow-auto`}>
            {songQueue.length >= 1
                ? <div className="relative">
                    <div className="gap-3 sticky top-0 right-0 z-(--z-pop-sidebar) bg-(--gray-clr) flex justify-end">
                        <button onClick={_ => setPopupWindow(true)} className="hover:text-(--red-clr)">
                            <EmptyQueueIcon className="w-7 h-7" />
                        </button>
                        <button className="hover:text-(--red-clr)"
                            onClick={_ => closeFn(false)}
                        >
                            <CloseIcon className="w-7 h-7" />
                        </button>
                    </div>

                    {songQueue.map(vid => (
                        <div key={vid.video_id} 
                            className="mx-3 relative hover:bg-(--light-gray-clr) hover:[&>button]:flex rounded-2xl"
                        >
                            <div onClick={_ => deleteSongQueue(vid.video_id)}>
                                <KaraokeVideoCard 
                                    video_id={vid.video_id}
                                    video_title={vid.video_title}
                                    channel_id={vid.channel_id}
                                    channel_title={vid.channel_title}
                                    thumbnail_url={vid.thumbnail_url}
                                    thumbnail_width={vid.thumbnail_width}
                                    thumbnail_height={vid.thumbnail_height}
                                    duration_sec={vid.duration_sec as number}
                                    disableQueBtn={true}
                                />
                            </div>
                            
                            <button className="hidden w-10 h-10 absolute bottom-2 right-2 justify-center items-center hover:bg-background rounded-full"
                                onClick={_ => {
                                    deleteSongQueue(vid.video_id)
                                }}
                            >
                                <DeleteIcon className="w-7 h-7" />
                            </button>
                        </div>
                    ))}
                </div>
                :<div className="w-full h-full relative flex justify-center items-center">
                    <button className="absolute top-0 right-2 hover:text-(--red-clr)"
                        onClick={_ => closeFn(false)}
                    >
                        <CloseIcon className="w-7 h-7" />
                    </button>
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
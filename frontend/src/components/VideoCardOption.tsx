"use client";

// Next.js
import { useState } from "react"

// Types
import { QueueNotifType } from "../types/states"

// Custom useHooks
import useSongQueue, { addSongQueueSelector, songQueueSelector } from "../utils/useSongQueue"

// Components
import AddToListIcon from "../svgs/AddToListIcon"
import SongAddedIcon from "../svgs/SongAddedIcon"
import QueueAlertIcon from "../svgs/QueueAlertIcon"
import BanIcon from "../svgs/BanIcon";
import RequestBanIcon from "../svgs/RequestBanIcon";
import MoreOptionsIcon from "../svgs/MoreOptionsIcon";

type VideoCardOptionProps = {
    video_details: VideoListResponse[number]
    currentUser: CurrentUserResponse | null
    className?: string
}

export default function VideoCardOption({ video_details, currentUser, className }: VideoCardOptionProps) {
    const [queueNotif, setQueueNotif] = useState<QueueNotifType>("none")
    const [openMore, setOpenMore] = useState(false)

    const songQueue = useSongQueue(songQueueSelector)
    const addSongQueue = useSongQueue(addSongQueueSelector)

    function addToQueue() {
        const exists = songQueue.find(vid => vid.video_id === video_details.video_id)
        if (!exists) {
            addSongQueue(video_details)
            setQueueNotif("added")
        }
        else setQueueNotif("error")

        setTimeout(() => {
            setQueueNotif("none")
        }, 3000)
    }
    
    return (
        <div className={`${className ?? ""} card-button`}>
            {currentUser 
                ? <div className="relative inline-block">
                    {/* Ban and Add to song queue buttons with Current User*/}
                    {queueNotif === "none"
                        && <>
                            <button onClick={_ => setOpenMore(p => !p)} className="more-option-btn rounded-full">
                                <MoreOptionsIcon className="w-7 h-7 text-foreground" />
                            </button>
                            
                            {openMore
                                && <>
                                    <div className="fixed inset-0 z-40" onClick={_ => setOpenMore(false)}/>
                                    
                                    <div className="more-btns w-55 absolute right-0 bg-foreground rounded text-background z-(--z-options)">
                                        <button className="rounded-t"
                                            onClick={_ => {
                                                addToQueue()
                                                setOpenMore(false)
                                            }}
                                        >
                                            <AddToListIcon className="w-7 h-7 text-background" />
                                            Add to queue
                                        </button>

                                        {currentUser.role === "admin"
                                            && <button className="rounded-b">
                                                <BanIcon className="w-7 h-7 text-background" />
                                                Ban Channel
                                            </button>
                                        }

                                        {currentUser.role == "user"
                                            && <button className="rounded-b">
                                                <RequestBanIcon className="w-7 h-7 text-background" />
                                                Request ban channel
                                            </button>
                                        }
                                    </div>
                                </>
                            }
                        </>
                    }

                    {queueNotif === "added"
                        && <SongAddedIcon className="w-7 h-7 text-green-400 font-bold" />
                    }
                    
                    {queueNotif === "error"
                        && <QueueAlertIcon className="w-7 h-7 text-(--red-clr) font-bold" />
                    }
                    </div>
                : ( // Add to song queue buttons without Current User
                    queueNotif === "none"
                        ? <button onClick={_ => addToQueue()}
                            className="rounded-full p-0.5 hover:bg-(--lucent-blk-clr)"
                        >
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
                )
            }
        </div>
    )
}
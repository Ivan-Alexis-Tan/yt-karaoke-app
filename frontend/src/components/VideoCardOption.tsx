import { useState } from "react"
import { QueueNotifType } from "../types/states"
import useSongQueue, { addSongQueueSelector, songQueueSelector } from "../utils/useSongQueue"
import AddToListIcon from "../svgs/AddToListIcon"
import SongAddedIcon from "../svgs/SongAddedIcon"
import QueueAlertIcon from "../svgs/QueueAlertIcon"

type VideoCardOptionProps = {
    video_details: VideoListResponse[number]
    className?: string
}

export default function VideoCardOption({ video_details, className }: VideoCardOptionProps) {
    const [queueNotif, setQueueNotif] = useState<QueueNotifType>("none")

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
        <div className={`${className ?? ""} card-button w-10 h-10 flex lg:hidden absolute bottom-2 right-2 justify-center items-center lg:hover:bg-(--lucent-blk-clr) rounded-full`}>
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
    )
}
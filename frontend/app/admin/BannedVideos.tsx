"use client";

// Next.js
import { useEffect, useState } from "react";
import Image from "next/image"
import Link from "next/link"

// Utils and other functions
import { getBannedVideos } from "@/src/api/ban"
import { formatMinutesSeconds } from "@/src/utils/helpers"
import PopupWindow, { usePopupWindow } from "@/src/components/PopupWindow";

// Components
import DeleteIcon from "@/src/svgs/DeleteIcon";

export default function BannedVideos({ currentUser, className }: { currentUser: CurrentUserResponse, className?: string }) {
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [bannedVideos, setBannedVideos] = useState<BannedVideosResponse>([])
    const { showPopup, openPopup, popupWindowStates } = usePopupWindow({ 
        "unbanVideo": false 
    })

    // Updates BannedVideos if currentPage changes
    useEffect(() => {
        const fetchBannedVideos = async () => {
            const bannedVideos = await getBannedVideos(currentPage)
            setBannedVideos(bannedVideos)
        }
        fetchBannedVideos()
    }, [currentPage])

    return (
        <div className={className ?? ""}>
            <h3 className="mb-3 text-xl font-bold">Banned Videos</h3>

            {/* Banned Videos Card Container */}
            <div className="admin-page-video-card mx-auto max-h-200 max-w-180 overflow-auto">
                
                {/* Banned Videos Card */}
                {bannedVideos.map(video => (
                    <div key={video.video_id} className="karaoke-banned-videos relative mx-auto max-w-160 hover:bg-(--gry-700) rounded-2xl">
                        
                        {/* Main Video Card */}
                        <Link className="gap-3 p-2 grid items-center grid-cols-2"
                            href={`/play/${video.video_id}`}
                        >
                            <div className="relative max-w-70">
                                <Image className="w-full rounded-2xl" 
                                    src={video.thumbnail_url} alt="video thumbnail" 
                                    width={640} height={480} 
                                />

                                <div className="px-0.5 absolute top-3 right-3 bg-(--lucent-blk-clr)">
                                    {new Date(video.date).toDateString().split(" ").slice(1).join(" ")}
                                </div>

                                <div className="px-0.5 absolute bottom-3 right-3 bg-(--lucent-blk-clr)">
                                    {formatMinutesSeconds(video.duration_sec as number)}
                                </div>
                            </div>

                            <div className="m-1.5 gap-1 flex flex-col justify-center text-white *:text-ellipsis *:overflow-hidden">
                                <h3 className="text-xl font-bold">{video.video_title}</h3>
                                <p>{video.channel_title}</p>
                            </div>
                        </Link>

                        {/* Banned Videos Unban Button */}
                        <button onClick={() => openPopup("unbanVideo")}
                            className="absolute bottom-2 right-2 hover:text-(--red-clr)"
                            title="Unban"
                        >
                            <DeleteIcon className="w-7 h-7" />
                        </button>

                        {/* Unban Popupwindow */}
                        {showPopup.unbanVideo
                            && <PopupWindow
                                windowId="unbanVideo"
                                popupWindowStates={popupWindowStates}
                                headerText={`Confirm Unban`}
                                confirmFn={() => {
                                    console.log(`Deleted ${video.video_title}`)
                                }}
                                subHeaderText={`Unban "${video.video_title}"?`}
                                confirmBtnText="Unban"
                                confirmBtnMode="warning"
                            />
                        }
                    </div>
                ))}
            </div>
            
            {/* View more Button */}
            <div onClick={_ => setCurrentPage(p => p + 1)}
                className="mx-auto max-w-25 my-2 px-1 text-center hover:bg-green-400 hover:text-black border rounded-full"
            >
                View more
            </div>
        </div>
    )
}
"use client";

// Next.js
import { Session } from "next-auth";
import Image from "next/image"

// Helper functions
import { capsWord, formatMinutesSeconds } from "@/src/utils/helpers"

// Components
import CheckCircleIcon from "@/src/svgs/CheckCircleIcon"
import ClockIcon from "@/src/svgs/ClockIcon"
import DialogueBubbleIcon from "@/src/svgs/DialogueBubbleIcon"
import SquareCloseIcon from "@/src/svgs/SquareCloseIcon"
import ThumbsDownIcon from "@/src/svgs/ThumbsDownIcon"
import ThumbsUpIcon from "@/src/svgs/ThumbsUpIcon"
import ApproveRejectBtns from "./ApproveRejectBtns";

type BanRequestCardProps = {
    banRequests: BanRequestsResponse
    session: Session
    className?: string
}

export default function BanRequestCards({
    banRequests,
    session,
    className
}: BanRequestCardProps) {
    return (
        <div className={className ?? ""}>
            {banRequests.map(request => (
                <div key={request.id} className="p-2 hover:bg-(--gry-700) rounded-2xl">
                    
                    {/* Request Header */}
                    <div className="mb-1 gap-8 flex justify-between">

                        {/* Ban Request Detail */}
                        <div className="gap-3 flex items-center">
                            <div className="gap-1 flex items-center">
                                {request.status === "pending"
                                    && <ClockIcon className="w-7 h-7" />
                                }

                                {request.status === "approved"
                                    && <CheckCircleIcon className="w-7 h-7 text-green-400" />
                                }

                                {request.status === "rejected"
                                    && <SquareCloseIcon className="w-7 h-7 text-(--red-clr)" />
                                }

                                <p>{capsWord(request.status)}</p>
                            </div>

                            <Image src={request.requested_user.picture}
                                width={640} height={480} alt="requested-user-image"
                                className="w-7 h-7 rounded-full border-background border"
                                title={request.requested_user.name}
                            />
                        </div>

                        {/* Approve or Reject Request */}
                        {request.status === "pending"
                            ? <ApproveRejectBtns banRequest={request} session={session} />
                            : <div className="gap-1 relative flex items-center justify-end">
                                <Image src={request.reviewed_user?.picture as string} 
                                    width={640} height={480} alt="requested-user-image"
                                    className="w-7 h-7 rounded-full border-background border"
                                    title={`${capsWord(request.status)}: ${request.reviewed_user?.name}`}
                                />

                                {request.status === "approved"
                                    && <ThumbsUpIcon className="w-3 h-3 absolute bottom-0 -left-0.75 bg-background text-green-400 rounded-full" />
                                }

                                {request.status === "rejected"
                                    && <ThumbsDownIcon className="w-3 h-3 absolute bottom-0 -left-0.75 bg-background text-(--red-clr) rounded-full" />
                                }
                            </div>
                        }
                    </div>

                    <div className="gap-1 flex">
                        <DialogueBubbleIcon className="w-7 h-7" title="Reason" />
                        <p className="italic">{request.reason ?? "No reason provided."}</p>
                    </div>

                    {/* Ban Request Video */}
                    <div className="mx-auto gap-3 max-w-200 p-2 grid items-center sm:grid-cols-2">
                        <div className="mx-auto relative max-w-70">
                            <Image className="w-full rounded-2xl" 
                                src={request.video.thumbnail_url} alt="video thumbnail" 
                                width={640} height={480} 
                            />

                            <div className="px-0.5 absolute top-3 right-3 bg-(--lucent-blk-clr)">
                                {new Date(request.date).toDateString().split(" ").slice(1).join(" ")}
                            </div>

                            <div className="px-0.5 absolute bottom-3 right-3 bg-(--lucent-blk-clr)">
                                {formatMinutesSeconds(request.video.duration_sec as number)}
                            </div>
                        </div>

                        <div className="m-1.5 gap-1 flex flex-col justify-center text-white *:text-ellipsis *:overflow-hidden">
                            <h3 className="text-xl font-bold">{request.video.video_title}</h3>
                            <p>{request.video.channel.channel_title}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
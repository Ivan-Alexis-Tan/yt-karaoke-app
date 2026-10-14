"use client";

// Next.js
import { useState } from "react";
import { Session } from "next-auth";

// Helper functions
import { requestBanVideo } from "../api/banRequest";

type BanRequestFormProps = {
    video_details: VideoType
    submitBtnFn: () => any
    cancelBtnFn: () => any
    session: Session
    className?: string
}

export default function BanRequestForm({ video_details, submitBtnFn = () => {}, cancelBtnFn, session, className }: BanRequestFormProps) {
    const [reason, setReason] = useState<string>("")

    return (
        <div className={`${className ?? ""} fixed top-0 left-0 w-full h-full z-(--z-popup-window) flex justify-center items-center bg-(--lucent-blk-clr)`}>
            <div className="w-100 h-100 p-5 flex flex-col justify-evenly items-center bg-(--light-gray-clr) text-white rounded-2xl">
                <div>
                    <h3 className="mb-3 text-xl font-bold text-center">Submit Ban Request</h3>
                    <p className="text-center">Ban {video_details.channel_title}</p>
                </div>

                <div className="w-full gap-3 [&_span]:px-1 flex flex-col [&_span]:text-end [&_span]:underline [&_span]:underline-offset-4 [&_span]:rounded [&_span]:hover:cursor-pointer">
                    <span onClick={_ => setReason("Not a karaoke video")}>
                        Not a karaoke video
                    </span>

                    <span onClick={_ => setReason("Uses AI pictures and videos")}>
                        Uses AI pictures and videos
                    </span>

                    <textarea
                        placeholder="Reason"
                        value={reason}
                        onChange={e => setReason(e.target.value)}
                        className="w-full max-h-35 h-20 p-2 border rounded"
                    />
                </div>

                <div className="popup-btns w-full flex justify-evenly *:p-2 *:border *:border-foreground *:rounded-2xl">
                    <button onClick={() => {
                        requestBanVideo(video_details.video_id, session as Session, reason)
                        submitBtnFn()
                    }}
                        className={`min-w-15 hover:bg-(--red-clr) hover:border-(--red-clr)`}
                    >
                        Submit
                    </button>
                    
                    <button onClick={_ => cancelBtnFn()}
                        className="hover:bg-white hover:text-black"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}
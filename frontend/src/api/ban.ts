"use server";

import { BASE_URL } from "../core/core";
import { Session } from "next-auth";

export async function banVideo(video: VideoListResponse[number], session: Session) {
    const res = await fetch(`${BASE_URL}/ban/videos/${video.video_id}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${session?.backendToken}`
        }
    })

    if (!res.ok) {
        const body = await res.text()
        throw new Error(`banVideo failed: ${res.status} ${body.slice(0, 300)}`)
    }
}

// export async function requestBanVideo(video_id: VideoListResponse[number]["video_id"]) {
//     await fetch(`${BASE_URL}`)
// }
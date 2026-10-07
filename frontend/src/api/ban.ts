"use server";

import { BASE_URL } from "../core/core";
import { Session } from "next-auth";

export async function banVideo(video: VideoType, session: Session) {
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

export async function getBannedChannels(page: number, session: Session): Promise<BannedChannelsResponse> {
    const res = await fetch(`${BASE_URL}/ban/channels?page=${page}`, {
        headers: {
            Authorization: `Bearer ${session?.backendToken}`
        }
    })

    if (!res.ok) {
        const body = await res.text()
        throw new Error(`banVideo failed: ${res.status} ${body.slice(0, 300)}`)
    }

    return await res.json()
}

export async function getBannedVideos(page: number = 1): Promise<BannedVideosResponse> {
    const res = await fetch(`${BASE_URL}/ban/videos?page=${page}`)

    if (!res.ok) {
        const body = await res.text()
        throw new Error(`banVideo failed: ${res.status} ${body.slice(0, 300)}`)
    }

    return await res.json()
}

// export async function requestBanVideo(video_id: VideoListResponse[number]["video_id"]) {
//     await fetch(`${BASE_URL}`)
// }
"use server";

// Next.js
import { Session } from "next-auth";

// Utils and other helpers
import { BASE_URL } from "../core/core";

export async function getBanRequests(page: number = 1): Promise<BanRequestsResponse> {
    const res = await fetch(`${BASE_URL}/ban_requests?page=${page}`)

    if (!res.ok) {
        const body = await res.text()
        throw new Error(`banVideo failed: ${res.status} ${body.slice(0, 300)}`)
    }

    return await res.json()
}


export async function requestBanVideo(
    video_id: VideoType["video_id"], 
    session: Session
) {
    const res = await fetch(`${BASE_URL}/ban_requests/${video_id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${session.backendToken}`},
    })

    if (!res.ok) {
        const body = await res.text()
        throw new Error(`banVideo failed: ${res.status} ${body.slice(0, 300)}`)
    }

    return await res.json()
}

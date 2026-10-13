"use server";

// Next.js
import { Session } from "next-auth";

// Utils and other helpers
import { BASE_URL } from "../core/core";

export async function getBanRequests(
    page: number = 1, 
    date_order: "recent" | "old" = "recent", 
    req_status: BanRequestStatus | "all" = "all"
): Promise<BanRequestsResponse> {
    let params

    if (req_status === "all") {
        params = { page: `${page}`, date_order }
    }
    else {
        params = { page: `${page}`, date_order, req_status }
    }

    const queryParams = new URLSearchParams(params)

    const res = await fetch(`${BASE_URL}/ban_requests?${queryParams.toString()}`)

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


export async function approveBanRequest(banRequestId: string, session: Session) {
    const res = await fetch(`${BASE_URL}/ban_requests/approve/${banRequestId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${session.backendToken}`},
        cache: "no-store",
    })

    if (!res.ok) {
        const body = await res.text()
        throw new Error(`banVideo failed: ${res.status} ${body.slice(0, 300)}`)
    }

    revalidatePath("/admin")
}


export async function rejectBanRequest(banRequestId: string, session: Session) {
    const res = await fetch(`${BASE_URL}/ban_requests/reject/${banRequestId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${session.backendToken}`},
        cache: "no-store",
    })

    if (!res.ok) {
        const body = await res.text()
        throw new Error(`banVideo failed: ${res.status} ${body.slice(0, 300)}`)
    }

    revalidatePath("/admin")
}
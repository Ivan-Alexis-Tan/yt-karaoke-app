"use server";

import { BASE_URL } from "../utils/helpers";

export async function getRandomVideos(videos_per_page: number = 15, limit: number = 30) {
    const params = new URLSearchParams
    params.append("videos_per_page", String(videos_per_page))
    params.append("limit", String(limit))
    
    return await fetch(`${BASE_URL}/videos/random?${params.toString()}`)
}

export async function cacheToHistory(videoId: string) {
    await fetch(`${BASE_URL}/videos/${videoId}/history`,
        {
            headers: {"Content-Type": "application/json"},
            method: "POST",
        }
    )
}

export async function getVideo(videoId: string) {
    return await fetch(`${BASE_URL}/videos/${videoId}`)
}
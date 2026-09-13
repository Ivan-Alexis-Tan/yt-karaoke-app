"use server";

import { BASE_URL } from "../utils/helpers";

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
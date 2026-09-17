"use server";

import { bannedChannels } from "../appData";
import { BASE_URL } from "../utils/helpers";

export async function getRandomVideos(videos_per_page: number = 15, limit: number = 30) {
    const params = new URLSearchParams
    params.append("videos_per_page", String(videos_per_page))
    params.append("limit", String(limit))

    const fetched = await fetch(`${BASE_URL}/videos/random?${params.toString()}`)
    const json: VideoListResponse[] = await fetched.json()

    return json.map(item => item.filter(
        vid => !bannedChannels.includes(vid.channel_title))
    )

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
    const fetched = await fetch(`${BASE_URL}/videos/${videoId}`)
    return await fetched.json()
}

// Search Video Fetchers
export async function searchVideosLocal(query: string): Promise<VideoListResponse> {
    const params = new URLSearchParams({ query }) 
    const fetched = await fetch(`${BASE_URL}/videos/local?${params.toString()}`)
    return await fetched.json()
}

export async function searchVideosOnline(query: string): Promise<VideoListResponse> {
    const params = new URLSearchParams({ query }) 
    const fetched = await fetch(`${BASE_URL}/youtube/search?${params.toString()}`)
    return await fetched.json()
}
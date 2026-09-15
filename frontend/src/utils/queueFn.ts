const locStorageKey = "ytKaraokeSongQueue"

export function getSongQueue(): VideoListResponse {
    const queue = localStorage.getItem(locStorageKey) as string
    if (!queue) return []

    return JSON.parse(queue)
}

export function _saveSongQueue(value: VideoListResponse ) {
    localStorage.setItem(locStorageKey, JSON.stringify(value))
}

export function addSongQueue(value: VideoListResponse[number]) {
    const queue = getSongQueue() as VideoListResponse
    if (queue.length >= 1) _saveSongQueue([...queue, value]);
}

export function emptySongQueue() {
    localStorage.setItem(locStorageKey, "[]")
}

export function deleteSongQueue(video_id: string) {
    const queue = getSongQueue()
    const remaining = queue.filter(vid => vid["video_id"] !== video_id)
    _saveSongQueue(remaining)
}

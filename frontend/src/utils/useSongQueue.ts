import { create } from "zustand"
import { persist } from "zustand/middleware"

type VideoIdType = VideoListResponse[number]["video_id"]

type useSongQueueStates = {
    songQueue: VideoListResponse
    addSongQueue: (video: VideoListResponse[number]) => void
    deleteSongQueue: (video_id: VideoIdType) => void
    emptySongQueue: () => void
}

export const useSongQueue = create<useSongQueueStates>()(
    persist(
        (set) => ({
            songQueue: [],
            addSongQueue: (video: VideoListResponse[number]) => set(
                s => ({ songQueue: [...s.songQueue, video] })
            ),
            deleteSongQueue: (video_id: VideoIdType) => set(
                s => ({ songQueue: s.songQueue.filter(vid => vid.video_id !== video_id) })
            ),
            emptySongQueue: () => set( _ => ({ songQueue: [] }) ),
        }),
        { name: "ytKaraokeSongQueue" }
    )
)

export const songQueueSelector = (state: useSongQueueStates) => state.songQueue
export const addSongQueueSelector = (state: useSongQueueStates) => state.addSongQueue
export const deleteSongQueueSelector = (state: useSongQueueStates) => state.deleteSongQueue
export const emptySongQueueSelector = (state: useSongQueueStates) => state.emptySongQueue

export default useSongQueue;
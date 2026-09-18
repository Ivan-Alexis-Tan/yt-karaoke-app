import { create } from "zustand"
import { persist } from "zustand/middleware"

type UseSongQueueStates = {
    songQueue: VideoListResponse
    addSongQueue: (video: VideoListResponse[number]) => void
    deleteSongQueue: (video_id: VideoIdType) => void
    emptySongQueue: () => void
}

export const useSongQueue = create<UseSongQueueStates>()(
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

export const songQueueSelector = (state: UseSongQueueStates) => state.songQueue
export const addSongQueueSelector = (state: UseSongQueueStates) => state.addSongQueue
export const deleteSongQueueSelector = (state: UseSongQueueStates) => state.deleteSongQueue
export const emptySongQueueSelector = (state: UseSongQueueStates) => state.emptySongQueue

export default useSongQueue;
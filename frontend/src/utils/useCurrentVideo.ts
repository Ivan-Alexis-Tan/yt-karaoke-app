import { create } from "zustand";
import { getVideo } from "../api/videosApi";

type UseVideosStates = {
    currentSong: VideoListResponse[number] | null
    addCurrentSong: (video_id: VideoIdType) => void
}

export const useCurrentVideo = create<UseVideosStates>((set) => ({
    currentSong: null,
    addCurrentSong: async (video_id: VideoIdType) => {
        const fetched = await getVideo(video_id)
        set(_ => ({ currentSong:  fetched }) )
    },
}))

export const currentSongSelector = (state: UseVideosStates) => state.currentSong
export const addCurrentSongSelector = (state: UseVideosStates) => state.addCurrentSong

export default useCurrentVideo
import { create } from "zustand";
import { getVideo } from "../api/videosApi";

type UseVideosStates = {
    currentSong: VideoListResponse[number] | null
    searchKey: string
    searchVideoList: VideoListResponse
    updateCurrentSong: (videoId: VideoIdType) => void
    updateVideoList: (videoList: VideoListResponse) => void
    updateSearchKey: (key: string) => void
}

export const useCurrentVideo = create<UseVideosStates>((set) => ({
    currentSong: null,
    searchKey: "",
    searchVideoList: [],
    updateCurrentSong: async (videoId: VideoIdType) => {
        const fetched = await getVideo(videoId)
        set(_ => ({ currentSong:  fetched }) )
    },
    updateVideoList: (videoList: VideoListResponse) => set(s => ({ ...s, searchVideoList: videoList}) ),
    updateSearchKey: (key: string) => set(s => ({ ...s, searchKey: key }) ),
}))

export const currentSongSelector = (state: UseVideosStates) => state.currentSong
export const addCurrentSongSelector = (state: UseVideosStates) => state.updateCurrentSong

export const searchKeySelector = (state: UseVideosStates) => state.searchKey
export const updateSearchKeySelector = (state: UseVideosStates) => state.updateSearchKey

export const videoListSelector = (state: UseVideosStates) => state.searchVideoList
export const updateVideoListSelector = (state: UseVideosStates) => state.updateVideoList

export default useCurrentVideo
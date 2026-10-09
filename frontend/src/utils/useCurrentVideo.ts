import { create } from "zustand";
import { getVideo } from "../api/videosApi";

type UseCurrentVideosStates = {
    currentSong: VideoListResponse[number] | null
    searchKey: string
    searchVideoList: VideoListResponse
    tempBannedChannels: VideoListResponse[number]["channel_title"][]
    updateCurrentSong: (videoId: VideoType["video_id"]) => void
    updateVideoList: (videoList: VideoListResponse) => void
    updateSearchKey: (key: string) => void
    updateTempBannedChannels: (video: VideoListResponse[number]["channel_title"]) => void
}

export const useCurrentVideo = create<UseCurrentVideosStates>((set) => ({
    currentSong: null,
    searchKey: "",
    searchVideoList: [],
    tempBannedChannels: [],
    updateCurrentSong: async (videoId: VideoType["video_id"]) => {
        const fetched = await getVideo(videoId)
        set(_ => ({ currentSong:  fetched }) )
    },
    updateVideoList: (videoList: VideoListResponse) => set(s => ({ ...s, searchVideoList: videoList}) ),
    updateSearchKey: (key: string) => set(s => ({ ...s, searchKey: key }) ),
    updateTempBannedChannels: (video: VideoListResponse[number]["channel_title"]) => set(
        s => ({ ...s, tempBannedChannels: [...s.tempBannedChannels, video] })
    )
}))

export const currentSongSelector = (state: UseCurrentVideosStates) => state.currentSong
export const addCurrentSongSelector = (state: UseCurrentVideosStates) => state.updateCurrentSong

export const searchKeySelector = (state: UseCurrentVideosStates) => state.searchKey
export const updateSearchKeySelector = (state: UseCurrentVideosStates) => state.updateSearchKey

export const videoListSelector = (state: UseCurrentVideosStates) => state.searchVideoList
export const updateVideoListSelector = (state: UseCurrentVideosStates) => state.updateVideoList

export const tempBannedChannelsSelector = (state: UseCurrentVideosStates) => state.tempBannedChannels
export const updateTempBannedChannelsSelector = (state: UseCurrentVideosStates) => state.updateTempBannedChannels

export default useCurrentVideo
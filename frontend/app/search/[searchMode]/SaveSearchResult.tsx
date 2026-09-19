"use client"

import useCurrentVideo, { updateSearchKeySelector, updateVideoListSelector } from "@/src/utils/useCurrentVideo"
import { useEffect } from "react"

type SaveSearchResultProps = {
    searchkey: string
    searchResultList: VideoListResponse
}

export default function SaveSearchResult({ searchkey, searchResultList }: SaveSearchResultProps) {
    const updateSearchKey = useCurrentVideo(updateSearchKeySelector)
    const updateVideoList = useCurrentVideo(updateVideoListSelector)

    useEffect(() => {
        updateSearchKey(searchkey)
        updateVideoList(searchResultList)
    }, [])

    return <div hidden />
}
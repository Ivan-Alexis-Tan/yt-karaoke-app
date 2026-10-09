// Utils, useHooks, and other helper fn
import { RECORD_TO_HISTORY } from "@/src/core/core";
import { cacheToHistory, getRandomVideos } from "@/src/api/videosApi";
import { getCurrentUser } from "@/src/api/auth";
import { auth } from "@/auth";

// Components
import MainPlayer from "./MainPlayer";

type PlayerPageProps = {
    params: Promise<{videoId: string}>
}

export default async function PlayerPage({ params }: PlayerPageProps) {
    const videoId = (await params).videoId;
    const session = await auth()
    const randomVideos = getRandomVideos()
    const currentUser = session ? getCurrentUser(session) : null
    if (RECORD_TO_HISTORY === "TRUE") await cacheToHistory(videoId);

    return (
        <div className="lg:h-[calc(100vh-75px)]">
            <MainPlayer 
                videoId={videoId}
                videoList={randomVideos}
                currentUser={currentUser}
                className="h-full"
            />
        </div>
    )
}
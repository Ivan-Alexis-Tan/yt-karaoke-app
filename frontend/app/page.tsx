import { Suspense } from "react";

import { getRandomVideos } from "@/src/api/videosApi";
import { auth } from "@/auth";
import { getCurrentUser } from "@/src/api/auth";

import VideoCardSkeleton from "@/src/components/skeletons/VideoCardSkeleton";
import PaginatedVideoCards from "../src/components/PaginatedVideoCards";


export default async function Home() {
  return (
    <div className="pb-5 bg-zinc-50 font-sans dark:bg-black">
      <Suspense fallback={<div className="
            px-10 w-full gap-3 grid 
            grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 [&_a]:grid-cols-1!
            items-start justify-between bg-white dark:bg-black
          "
        >
          {Array.from({ length: 10 }, (_, k) => (
            <VideoCardSkeleton key={k} 
              
            />))
          }
        </div>
      }>
        <RandomVidsResult />
      </Suspense>
    </div>
  );
}

const RandomVidsResult = async () => {
  const randomVideos = getRandomVideos(15, 60)
  const session = await auth()
  const currentUser = session ? await getCurrentUser(session) : null
  
  return (
    <PaginatedVideoCards 
      className="
        px-10 w-full gap-3 grid 
        grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 [&_a]:grid-cols-1!
        items-start justify-between bg-white dark:bg-black [&_div.karaoke-video-card]:w-full
      "
      videoList={randomVideos} 
      currentUser={currentUser}
      arrange_videos="col"  
    />
  )
}

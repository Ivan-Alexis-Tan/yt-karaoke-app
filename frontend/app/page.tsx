
import { BASE_URL } from "@/src/utils/helpers"
import ShowVideos from "./ShowVideos";
import { getRandomVideos } from "@/src/api/videosApi";

export default async function Home() {
  const randomVideos = await getRandomVideos(15, 60)

  return (
    <div className="pb-5 bg-zinc-50 font-sans dark:bg-black">
      <ShowVideos 
        className="px-10 w-full gap-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-start justify-between bg-white dark:bg-black"
        videoList={randomVideos} 
        arrange_videos="col"  
      />
    </div>
  );
}

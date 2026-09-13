import KaraokeVideoCard from "@/src/components/KaraokeVideoCard"

import { BASE_URL } from "@/src/utils/helpers"

export default async function Home() {
  const getRandomVideos = await fetch(`${BASE_URL}/videos/random`)
  const randomVideos: VideoListResponse[] = await getRandomVideos.json()
  
  return (
    <div className="bg-zinc-50 font-sans dark:bg-black">
      <div className="px-10 w-full gap-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-start justify-between bg-white dark:bg-black">
        {randomVideos[0].map(vid => (
          <KaraokeVideoCard key={vid.video_id}
            video_id={vid.video_id}
            video_title={vid.video_title}
            channel_id={vid.channel_id}
            channel_title={vid.channel_title}
            thumbnail_url={vid.thumbnail_url}
            thumbnail_width={vid.thumbnail_width}
            thumbnail_height={vid.thumbnail_height}
            duration_sec={vid.duration_sec as number}
          />
        ))}
      </div>
    </div>
  );
}

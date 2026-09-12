import KaraokeVideoCard from "@/src/components/KaraokeVideoCard"

export default async function Home() {
  const baseUrl = "http://localhost:8000/api"

  const query = encodeURIComponent("spongecola")
  const ytSearch = await fetch(`${baseUrl}/youtube/search?query=${query}`)
  const ytSearchResults: VideoListResponse = await ytSearch.json()

  const ytVideo = await fetch(`${baseUrl}/youtube/video/EGo3a0Lbsx4`)
  const videoJson = await ytVideo.json()

  const getRandomVideos = await fetch(`${baseUrl}/videos/random`)
  const randomVideos: VideoListResponse[] = await getRandomVideos.json()

  console.log(`ytSearchResults =`, ytSearchResults)
  console.log("=================")
  console.log(`videoJson =`, videoJson)
  console.log("=================")
  console.log(`randomVideos =`, randomVideos)
  console.log(randomVideos[0])
  
  return (
    <div className="bg-zinc-50 font-sans dark:bg-black">
      <div className="px-10 w-full gap-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-start justify-between bg-white dark:bg-black">
        {/* <iframe src="http://youtube.com/embed/EGo3a0Lbsx4"
          width={550} 
          height={500} 
          allowFullScreen
          className="mb-5"
        ></iframe> */}

        {/* {ytSearchResults.length >= 1
          ? ytSearchResults.map(vid => {
            return (
              <div key={vid.video_id} className="flex gap-3 mb-5 border">
                <div>
                  <img src={vid.thumbnail_url} alt="video thumbnail" 
                    width={vid.thumbnail_width} height={vid.thumbnail_height} 
                  />
                </div>

                <div className="gap-3 flex flex-col justify-center">
                  <h3 className="text-xl font-bold">{vid.video_title}</h3>
                  <p>{vid.channel_title}</p>
                </div>
              </div>
            )
          })
          : <p className="text-xl">No searches found</p>
        } */}

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

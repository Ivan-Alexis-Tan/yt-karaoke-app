import KaraokeVideoCard from "@/src/components/KaraokeVideoCard"

export default async function Home() {
  const baseUrl = "http://localhost:8000/api"

  const query = encodeURIComponent("spongecola")
  const ytSearch = await fetch(`${baseUrl}/youtube/search?query=${query}`)
  const ytSearchResults: VideoListResponse = await ytSearch.json()

  const ytVideo = await fetch(`${baseUrl}/youtube/video/EGo3a0Lbsx4`)
  const videoJson = await ytVideo.json()

  const caches = await fetch("http://localhost:8000/api/test/cache")
  const cacheJson = await caches.json()

  console.log(`ytSearchResults =`, ytSearchResults)
  console.log("=================")
  console.log(`videoJson =`, videoJson)
  console.log("=================")
  console.log(`cacheJson =`, cacheJson)
  
  return (
    <div className="flexflex-colflex-1items-centerjustify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-3xl flexflex-1flex-col items-centerjustify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <iframe src="http://youtube.com/embed/EGo3a0Lbsx4"
          width={550} 
          height={500} 
          allowFullScreen
          className="mb-5"
        ></iframe>
      
        {/* <table className="border-collapse [&,&_td,&_th]:border [&_td,&_th]:p-2">
          <thead>
            <tr>
              {Object.keys(data[0]).map(item => (
                <th key={item}>{item}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={`c${idx}`}>
                {Object.keys(row).map((item, i) => (
                  <td key={`r${i}c${idx}`}>{row[item as keyof (typeof row)]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table> */}

        {searchVideoInfos.length >= 1
          ? searchVideoInfos.map(vid => {
            const vidId = vid.id
            const thumbnail = vid.thumbnails.medium
            return (
              <div key={vidId.videoId} className="flex gap-3 mb-5 border">
                <div>
                  <img src={thumbnail.url} alt="video thumbnail" 
                    width={thumbnail.width} height={thumbnail.height} 
                  />
                </div>

                <div className="gap-3 flex flex-col justify-center">
                  <h3 className="text-xl font-bold">{vid.title}</h3>
                  <p>{vid.channelTitle}</p>
                </div>
              </div>
            )
          })
          : <p className="text-xl">No searches found</p>
        }
      </main>
    </div>
  );
}

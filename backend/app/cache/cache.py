from datetime import datetime

cache = {
    "users": {
        "expires": datetime.utcnow(),
        "data": [],
    },
    "search_cache": [],
    "videos": [],
}

ytSearchResult = {
    'kind': 'youtube#searchListResponse', 
    'etag': 'Nsq1djQFTkFf0RZCHGJFXJufOgo', 
    'nextPageToken': 'CAoQAA', 
    'regionCode': 'PH', 
    'pageInfo': {'totalResults': 329191, 'resultsPerPage': 10}, 
    'items': [
        {
            'kind': 'youtube#searchResult', 
            'etag': 'vObVty8Egb8CFYaxhn-9id07uQs', 
            'id': {'kind': 'youtube#video', 'videoId': 'e25XlvKe1Wk'}, 
            'snippet': {
                'publishedAt': '2025-03-13T09:18:45Z', 
                'channelId': 'UCRoAoGqqLuOIWztkcxUiYoA', 
                'title': 'Sponge Cola - Kay Tagal Kitang Hinintay (Karaoke)', 
                'description': 'karaoke #karaokeversion #karaokesongs This is my Karaoke cover of Kay Tagal Kitang Hinintay by Sponge Cola. All tracks were ...', 
                'thumbnails': {
                    'default': {'url': 'https://i.ytimg.com/vi/e25XlvKe1Wk/default.jpg', 'width': 120, 'height': 90}, 
                    'medium': {'url': 'https://i.ytimg.com/vi/e25XlvKe1Wk/mqdefault.jpg', 'width': 320, 'height': 180}, 
                    'high': {'url': 'https://i.ytimg.com/vi/e25XlvKe1Wk/hqdefault.jpg', 'width': 480, 'height': 360}
                },
                'channelTitle': 'Mi Balmz Karaoke Tracks', 
                'liveBroadcastContent': 'none', 
                'publishTime': '2025-03-13T09:18:45Z'
            }
        }, 
        {
            'kind': 'youtube#searchResult', 
            'etag': 'ulzPblQ0bC61WfLtjYC5kTCKd_k', 
            'id': {'kind': 'youtube#video', 'videoId': 'gfzb3lcZjRg'}, 
            'snippet': {
                'publishedAt': '2022-03-09T00:00:18Z', 
                'channelId': 'UCutZyApGOjqhOS-pp7yAj4Q', 
                'title': 'NAKAPAGTATAKA - Sponge Cola (HD Karaoke)', 
                'description': 'Ito ang awiting unang inawit at pinasikat ng OPM legendary trio na "The APO Hiking Society" at muling binigyang buhay ng ...', 
                'thumbnails': {
                    'default': {'url': 'https://i.ytimg.com/vi/gfzb3lcZjRg/default.jpg', 'width': 120, 'height': 90}, 'medium': {'url': 'https://i.ytimg.com/vi/gfzb3lcZjRg/mqdefault.jpg', 'width': 320, 'height': 180}, 'high': {'url': 'https://i.ytimg.com/vi/gfzb3lcZjRg/hqdefault.jpg', 'width': 480, 'height': 360}
                }, 
                'channelTitle': 'Atomic Karaoke... ', 
                'liveBroadcastContent': 'none',
                'publishTime': '2022-03-09T00:00:18Z'
            }
        }, 
        {
            'kind': 'youtube#searchResult', 
            'etag': 'nUgvPEhK4f-IIpNbBdooJjSgee0', 
            'id': {'kind': 'youtube#video', 'videoId': 'ZD3qmtSZHTk'}, 
            'snippet': {
                'publishedAt': '2022-05-11T03:35:30Z', 
                'channelId': 'UCJ4_xcVtAkRhZ3eAEmI_r-Q', 
                'title': 'DI NA MABABAWI - Sponge Cola (KARAOKE Version)', 
                'description': 'Di Na Mababawi - Sponge Cola (from "Sponge Cola" 2008 album) Lyrics: Ngayo\'y aking inuunawang pilit Mga pagkukulang kong ...', 
                'thumbnails': {
                    'default': {'url': 'https://i.ytimg.com/vi/ZD3qmtSZHTk/default.jpg', 'width': 120, 'height': 90}, 'medium': {'url': 'https://i.ytimg.com/vi/ZD3qmtSZHTk/mqdefault.jpg', 'width': 320, 'height': 180}, 'high': {'url': 'https://i.ytimg.com/vi/ZD3qmtSZHTk/hqdefault.jpg', 'width': 480, 'height': 360}
                }, 
                'channelTitle': 'KaraOcraze', 
                'liveBroadcastContent': 'none', 
                'publishTime': '2022-05-11T03:35:30Z'
            }
        }, 
        {
            'kind': 'youtube#searchResult', 
            'etag': '17RGZkuJitEHuADxmMeAGShmuLE', 
            'id': {'kind': 'youtube#video', 'videoId': 'heG-2TnOiaY'}, 
            'snippet': {
                'publishedAt': '2021-04-15T06:56:16Z', 
                'channelId': 'UCwU0jKwBA9pDysMi2uewNMw', 
                'title': 'JEEPNEY - SPONGE COLA (karaoke version)', 
                'description': "Welcome to My All Time Karaoke Channel   Don't forget to: LIKE SUBSCRIBE HIT that notification bell for more ...", 
                'thumbnails': {
                    'default': {'url': 'https://i.ytimg.com/vi/heG-2TnOiaY/default.jpg', 'width': 120, 'height': 90}, 'medium': {'url': 'https://i.ytimg.com/vi/heG-2TnOiaY/mqdefault.jpg', 'width': 320, 'height': 180}, 'high': {'url': 'https://i.ytimg.com/vi/heG-2TnOiaY/hqdefault.jpg', 'width': 480, 'height': 360}
                }, 
                'channelTitle': 'My All Time Karaoke', 
                'liveBroadcastContent': 'none', 
                'publishTime': '2021-04-15T06:56:16Z'
            }
        }, 
        {
            'kind': 'youtube#searchResult', 
            'etag': 'iUzKhVQy8qiZojOQvvQHpJ_ho3I', 
            'id': {'kind': 'youtube#video', 'videoId': 'J3i8VAc_vYQ'}, 
            'snippet': {
                'publishedAt': '2025-08-18T09:15:02Z', 
                'channelId': 'UC-BjrRzAujV2glTNKcwEG0g', 
                'title': 'PASUBALI - Sponge Cola (HD KARAOKE Version)', 
                'description': '4K ULTRA HD KARAOKE CONTENT JUST FOR YOU. Thank you for Watching! HOPE YOU ENJOY ^_^ SING IT WITH YOUR ...', 
                'thumbnails': {
                    'default': {'url': 'https://i.ytimg.com/vi/J3i8VAc_vYQ/default.jpg', 'width': 120, 'height': 90}, 'medium': {'url': 'https://i.ytimg.com/vi/J3i8VAc_vYQ/mqdefault.jpg', 'width': 320, 'height': 180}, 'high': {'url': 'https://i.ytimg.com/vi/J3i8VAc_vYQ/hqdefault.jpg', 'width': 480, 'height': 360}
                }, 
                'channelTitle': 'RyScape STUDIO', 
                'liveBroadcastContent': 'none', 
                'publishTime': '2025-08-18T09:15:02Z'
            }
        }, 
        {
            'kind': 'youtube#searchResult', 
            'etag': 'yMIqQN2cJcvuyvWBzlkx29_Scsk', 
            'id': {'kind': 'youtube#video', 'videoId': 'uZf59golNF0'}, 
            'snippet': {
                'publishedAt': '2024-02-18T06:44:46Z', 
                'channelId': 'UCJ4_xcVtAkRhZ3eAEmI_r-Q', 
                'title': 'MAKAPILING KA - Sponge Cola (KARAOKE Version)', 
                'description': 'Makapiling Ka Karaoke #karaoke #karaokesongs #makapilingka by Sponge Cola (from "Sponge Cola" 2008 album) Stay tuned ...', 
                'thumbnails': {
                    'default': {'url': 'https://i.ytimg.com/vi/uZf59golNF0/default.jpg', 'width': 120, 'height': 90}, 'medium': {'url': 'https://i.ytimg.com/vi/uZf59golNF0/mqdefault.jpg', 'width': 320, 'height': 180}, 'high': {'url': 'https://i.ytimg.com/vi/uZf59golNF0/hqdefault.jpg', 'width': 480, 'height': 360}
                }, 
                'channelTitle': 'KaraOcraze', 
                'liveBroadcastContent': 'none', 
                'publishTime': '2024-02-18T06:44:46Z'}
            }, 
            {
                'kind': 'youtube#searchResult', 
                'etag': 'EfI2J_SFNJm10PTDrzrgbtkWGkg', 
                'id': {'kind': 'youtube#video', 'videoId': 'iufUQWidHM0'}, 
                'snippet': {
                    'publishedAt': '2021-04-11T10:08:10Z', 
                    'channelId': 'UCwU0jKwBA9pDysMi2uewNMw', 
                    'title': 'CRAZY FOR YOU - SPONGE COLA (karaoke version)', 
                    'description': "Welcome to My All Time Karaoke Channel   Don't forget to: LIKE SUBSCRIBE HIT that notification bell for more ...", 
                    'thumbnails': {
                        'default': {'url': 'https://i.ytimg.com/vi/iufUQWidHM0/default.jpg', 'width': 120, 'height': 90}, 'medium': {'url': 'https://i.ytimg.com/vi/iufUQWidHM0/mqdefault.jpg', 'width': 320, 'height': 180}, 'high': {'url': 'https://i.ytimg.com/vi/iufUQWidHM0/hqdefault.jpg', 'width': 480, 'height': 360}
                    }, 
                    'channelTitle': 'My All Time Karaoke', 'liveBroadcastContent': 'none', 'publishTime': '2021-04-11T10:08:10Z'
                }
            }, 
            {
                'kind': 'youtube#searchResult', 
                'etag': 'V9aUTqQzB1T-RxzXJ3fYVJnJ380', 
                'id': {'kind': 'youtube#video', 'videoId': 'SQ7j9CKZByU'}, 
                'snippet': {
                    'publishedAt': '2025-08-02T08:30:12Z', 
                    'channelId': 'UC3LhPivZFKC3LTMA_Wq7cXQ', 
                    'title': 'KAY TAGAL KITANG HININTAY - Sponge Cola (Karaoke Version)', 'description': 'Song: Kay Tagal Kitang Hinintay Original Artist: Sponge Cola Instrumental Cover: \u202aCARAoke TV * Original Source:\u202c ...', 
                    'thumbnails': {
                        'default': {'url': 'https://i.ytimg.com/vi/SQ7j9CKZByU/default.jpg', 'width': 120, 'height': 90}, 'medium': {'url': 'https://i.ytimg.com/vi/SQ7j9CKZByU/mqdefault.jpg', 'width': 320, 'height': 180}, 'high': {'url': 'https://i.ytimg.com/vi/SQ7j9CKZByU/hqdefault.jpg', 'width': 480, 'height': 360}
                    }, 
                    'channelTitle': 'CARAoke TV', 
                    'liveBroadcastContent': 'none', 
                    'publishTime': '2025-08-02T08:30:12Z'
                }
            }, 
            {
                'kind': 'youtube#searchResult', 
                'etag': 'un4B_SD6nf943D5qyK0mWO6fBBM', 
                'id': {'kind': 'youtube#video', 'videoId': 'VjCOgLu-Buw'}, 
                'snippet': {
                    'publishedAt': '2022-05-11T03:36:54Z', 
                    'channelId': 'UCJ4_xcVtAkRhZ3eAEmI_r-Q', 
                    'title': 'KAY TAGAL KITANG HININTAY - Sponge Cola (KARAOKE Version)', 
                    'description': 'Kay Tagal Kitang Hinintay - Sponge Cola (from "Araw Oras Tagpuan" 2011 album) Lyrics: Hawakan mo ang aking kamay at ...', 
                    'thumbnails': {
                        'default': {'url': 'https://i.ytimg.com/vi/VjCOgLu-Buw/default.jpg', 'width': 120, 'height': 90}, 'medium': {'url': 'https://i.ytimg.com/vi/VjCOgLu-Buw/mqdefault.jpg', 'width': 320, 'height': 180}, 'high': {'url': 'https://i.ytimg.com/vi/VjCOgLu-Buw/hqdefault.jpg', 'width': 480, 'height': 360}
                    }, 
                    'channelTitle': 'KaraOcraze', 
                    'liveBroadcastContent': 'none', 
                    'publishTime': '2022-05-11T03:36:54Z'
                }
            }, 
            {
                'kind': 'youtube#searchResult', 
                'etag': 'gV1cNmMz0ki-6ZHTcPyhNpavW-0', 
                'id': {'kind': 'youtube#video', 'videoId': 'NWe84SMmEqk'}, 
                'snippet': {
                    'publishedAt': '2022-05-11T03:46:08Z', 
                    'channelId': 'UCJ4_xcVtAkRhZ3eAEmI_r-Q', 
                    'title': 'TULIRO - Sponge Cola (KARAOKE Version)', 
                    'description': 'Tuliro - Sponge Cola (from "Transit" 2006 album) Lyrics: Labis ako\'y nahuhumaling Sabik sa bawat sandaling Ika\'y makapiling ...', 
                    'thumbnails': {
                        'default': {'url': 'https://i.ytimg.com/vi/NWe84SMmEqk/default.jpg', 'width': 120, 'height': 90}, 'medium': {'url': 'https://i.ytimg.com/vi/NWe84SMmEqk/mqdefault.jpg', 'width': 320, 'height': 180}, 'high': {'url': 'https://i.ytimg.com/vi/NWe84SMmEqk/hqdefault.jpg', 'width': 480, 'height': 360}
                    }, 
                    'channelTitle': 'KaraOcraze', 
                    'liveBroadcastContent': 'none', 
                    'publishTime': '2022-05-11T03:46:08Z'
                }
            }
        ]
}

ytVideo = {
  "kind": "youtube#videoListResponse",
  "etag": "7qkAoSJ2Pf79mgyuIpzmwQ5Uqe0",
  "items": [
    {
      "kind": "youtube#video",
      "etag": "YzEAT8miipc9N0AxCIAK8zBMe78",
      "id": "EGo3a0Lbsx4",
      "snippet": {
        "publishedAt": "2020-08-24T19:21:54Z",
        "channelId": "UCUrt49hWwY1kPNxbEpsMm3g",
        "title": "Sana by Shamrock Karaoke Version",
        "description": "Please Dont Forget to Like,Share,Subscribe And hit the notification bell To My Channel to Always be Updated on new Videos.\n\nFor More Karaoke Song Click the link Below\nhttps://www.youtube.com/channel/UCUrt49hWwY1kPNxbEpsMm3g/videos\n\n\n\n\nDO NOT RE UPLOAD MY KARAOKE\nPUT A LINK OF MY CHANNEL https://www.youtube.com/channel/UCUrt49hWwY1kPNxbEpsMm3g/videos\nAND CREDIT TO '''Videoke Lovers'' FOR THE INSTRUMENTAL IN YOUR VIDEO  DESCRIPTION.\n\n#sanakaraoke #sanashamrockkaraoke #sana",
        "thumbnails": {
          "default": {
            "url": "https://i.ytimg.com/vi/EGo3a0Lbsx4/default.jpg",
            "width": 120,
            "height": 90
          },
          "medium": {
            "url": "https://i.ytimg.com/vi/EGo3a0Lbsx4/mqdefault.jpg",
            "width": 320,
            "height": 180
          },
          "high": {
            "url": "https://i.ytimg.com/vi/EGo3a0Lbsx4/hqdefault.jpg",
            "width": 480,
            "height": 360
          },
          "standard": {
            "url": "https://i.ytimg.com/vi/EGo3a0Lbsx4/sddefault.jpg",
            "width": 640,
            "height": 480
          },
          "maxres": {
            "url": "https://i.ytimg.com/vi/EGo3a0Lbsx4/maxresdefault.jpg",
            "width": 1280,
            "height": 720
          }
        },
        "channelTitle": "Videoke Lovers",
        "tags": [
          "videokelovers",
          "videoke lovers",
          "videoke lovers karaoke",
          "videokelovers karaoke",
          "bossanova karaoke",
          "reggae karaoke",
          "love song karaoke",
          "sana",
          "sana karaoke shamrock",
          "sana instrumental",
          "sana karaoke",
          "minus one",
          "karaoke version"
        ],
        "categoryId": "24",
        "liveBroadcastContent": "none",
        "defaultLanguage": "en",
        "localized": {
          "title": "Sana by Shamrock Karaoke Version",
          "description": "Please Dont Forget to Like,Share,Subscribe And hit the notification bell To My Channel to Always be Updated on new Videos.\n\nFor More Karaoke Song Click the link Below\nhttps://www.youtube.com/channel/UCUrt49hWwY1kPNxbEpsMm3g/videos\n\n\n\n\nDO NOT RE UPLOAD MY KARAOKE\nPUT A LINK OF MY CHANNEL https://www.youtube.com/channel/UCUrt49hWwY1kPNxbEpsMm3g/videos\nAND CREDIT TO '''Videoke Lovers'' FOR THE INSTRUMENTAL IN YOUR VIDEO  DESCRIPTION.\n\n#sanakaraoke #sanashamrockkaraoke #sana"
        },
        "defaultAudioLanguage": "en"
      },
      "contentDetails": {
        "duration": "PT4M1S",
        "dimension": "2d",
        "definition": "hd",
        "caption": "false",
        "licensedContent": True,
        "contentRating": {},
        "projection": "rectangular"
      }
    }
  ],
  "pageInfo": {
    "totalResults": 1,
    "resultsPerPage": 1
  }
}
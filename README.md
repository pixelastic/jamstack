# Jamstack

This repository holds the code of a proof-of-concept of a search into Jamstack videos
and captions from YouTube playlist.

Raw data is extracted from the YouTube API, formatted into structured JSON and
saved on disk, and then pushed into an Algolia index, ready to be queried by the
frontend.

## How does this work?

The bulk of the job is done by the
[youtinx][1] module. It has been developed
specifically for this project, but exported into its own module to be able to
more easily adapt to any other YouTube account.

`youtinx` comes with with two commands: `pull` and `push`. They are aliased in
this repository as `yarn run data:pull` and `yarn run data:push`.

The `pull` command will fetch video metadata from the YouTube API and save it on
disk. The `push` command will format it in a way suitable for Algolia and push
it to Algolia servers.

## Pulling

`youtinx pull` will read the list of playlists configured in the `youtinx.config.js`
file. It will then query the YouTube API to fetch video metadata (id, title,
number of views, duration, etc) for all videos included in those playlists. It
will also fetch the captions (subtitles) for those videos. All this data is
saved on disk in the `./data` folder, in structured JSON files.

The script will fetch manually uploaded subtitles if available, or fallback to
the auto-generated ones otherwise. The quality of those captions is variable,
and highly dependent on the accent of the speaker. Sometimes, it cannot even
generate automated captions.

You will need a `YOUTUBE_API_KEY` as an environment variable to run this part.
The YouTube API as a daily quota limit of 10k calls, but you shouldn't hit the
limit. See [this page]\(YouTube API video duration) for more information.

## Pushing

`youtinx push` will read the data saved in `./data`, format it in a way suitable
for Algolia and push it into an Algolia index specifically configured for this
kind of data.

Internally, it will create one Algolia record per **line of caption**. This is
needed so we can jump directly to the moment in a video this specific line was
said. The index is configured to use the `groupBy` feature of Algolia, which is
similar to a `GROUP BY` in SQL: for each video, it will only return the most
relevant caption. See below for a full example of the structured data.

You will need a `ALGOLIA_API_KEY` with write access as an environment variable
to run this part. The account you provided us should be large enough for you to
run the script without hitting any limit either.

## Data structure

```js
const record = {
  // Information about this matching caption line
  "caption": {
    // The content of the caption
    "content": "hello everyone i'm uh really happy to to talk here today and uh thank you very",
    // The start time, in seconds
    "start": 0
  },
  // Information about the parent video
  "video": {
    // Description, as displayed on Youtube
    "description": "Talk given by Nicolas Goutay, at the remote JAMstack Meetup #14 on July 27th, 2020.\nhttps://twitter.com/Phacks\nhttps://www.meetup.com/JAMStack_berlin/events/270907371/\n\nDuring the last two years, the median webpage size across the web increased by over 30%, from 1.5Mb to 2Mb—resulting in worse performance for end-users.\r\n\r\nWhile the Jamstack philosophy is rooted in frugality, many recent Jamstack approaches rely on heavy JavaScript frameworks that give us top-notch Developer Experience at the expense of heavier web pages. What is the true cost of those frameworks? And how can we alleviate it?\r\n\r\nIn this talk, I will first describe the end-user impact of using JavaScript frameworks, then discuss options to reduce that impact for existing Jamstack websites, to finally present and review the “lightweight Jamstack” we used to redesign https://orbit.love: Eleventy, Alpine and Tailwind.\n\nContentful Developer portal - www.contentful.com/developers/\nContentful Community Slack - www.contentful.com/slack/",
    // Duration in seconds
    "duration": 1642,
    // Id, to be used in urls
    "id": "taOyVmLgym4",
    // Publication timestamp
    "publishedAt": 1596629212,
    // Some stats about the popularity
    "ranking": {
      "likes": 24,
      "views": 633
    },
    // Reference to the video thumbnail in various sizes.
    // Note that not some sizes might not be available for some videos
    "thumbnails": {
      "large": "https://i.ytimg.com/vi/taOyVmLgym4/sddefault.jpg",
      "medium": "https://i.ytimg.com/vi/taOyVmLgym4/hqdefault.jpg",
      "small": "https://i.ytimg.com/vi/taOyVmLgym4/mqdefault.jpg",
      "tiny": "https://i.ytimg.com/vi/taOyVmLgym4/default.jpg"
    },
    "title": "Eleventy, Alpine and Tailwind: towards a lightweight Jamstack by Nicolas Goutay"
  },
  "playlist": {
    "description": "A collection of tutorials, presentations and interviews exploring Jamstack technologies and ecosystem",
    // Playlist id
    "id": "PL58Wk5g77lF-VssZBBOxEWCd6AODGNtND",
    "publishedAt": "2020-11-30T12:10:21Z",
    "title": "Tutorials and Presentations"
  },
  // This is used internally by Algolia, you can ignore this one
  "objectID": "a7e969170c00005dd1904dc00a5650ab1dfbeb76bfdfea81b9553b744b320f03",
}
```

## Caching

All response from YouTube API calls are saved on disk, in the `.cache/` folder.
This means that if you run `youtinx pull` twice in a row, you won't see any
change as it will use data saved in this cache folder. We recommend emptying
this folder if you need to run the scripts from scratch again.

## Configuration

The `youtinx.config.js` file is the main source of configuration. In addition to
the list of playlist, it's also where you can define the list of videos you
**know** don't have captions. This will prevent `youtinx` from displaying
a warning each time it encounters them.

## Searching

A demo website is also available in this repository. You can see it live on
[https://jamstackconf-search.netlify.app/][2], or spin it locally with `yarn run
serve`.

[1]: https://github.com/pixelastic/youtinx

[2]: https://jamstackconf-search.netlify.app/

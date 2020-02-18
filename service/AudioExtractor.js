"use strict";

import StringParser from "./StringParser.js";

const AudioExtractor = {
    extract: (string) => {
        let data = StringParser.parse(string),
            videoDetails = JSON.parse(data.player_response).videoDetails;
        return {
            streams: AudioExtractor.getStreams(data),
            title: videoDetails.title.replace(/\+/gi, " "),
            author: videoDetails.author.replace(/\+/gi, " "),
            thumbnailUrl: videoDetails.thumbnail.thumbnails.reduce(
                (prev, current) => (prev.height > current.height) ? prev : current
            ).url
        };
    }

    , getStreams: (data) => {
        //YouTube has deprecated get_video_info to get stream url
        if (!data.hasOwnProperty("url_encoded_fmt_stream_map") || !data.hasOwnProperty("adaptive_fmts")) {
            return  {"128kbps": "assets/sounds/failed.mp4"};
        }
        let streams = (data.url_encoded_fmt_stream_map + "," + data.adaptive_fmts).split(","),
            stream,
            streamsObject = {},
            streamObject = {},
            quality = false;
        for (stream of streams) {
            streamObject = StringParser.parse(stream);
            switch (streamObject.itag) {
                case "139":
                    streamsObject["48kbps"] = streamObject.url;
                    break;
                case "140":
                    streamsObject["128kbps"] = streamObject.url;
                    break;
                case "141":
                    streamsObject["256kbps"] = streamObject.url;
                    break;
            }
        }
        return streamsObject;
    }
};

export default AudioExtractor;
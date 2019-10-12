import StringParser from "./StringParser.js";

const AudioExtractor = {
    extract : (string) => {
        let data = StringParser.parse(string),
            videoDetails = JSON.parse(data.player_response).videoDetails;
        return {
            streams: AudioExtractor.getStreams(data),
            title: videoDetails.title.replace(/\+/gi, " "),
            author: videoDetails.author.replace(/\+/gi, " "),
            thumbnailUrl: AudioExtractor.getBiggerThumbnailUrl(videoDetails.thumbnail.thumbnails)
        };
    }

    , getStreams: (data) => {
        if (!data.hasOwnProperty("url_encoded_fmt_stream_map") || !data.hasOwnProperty("adaptive_fmts")) {
            throw "I can't play song video or other property one";
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
                    quality = "48kbps";
                    break;
                case "140":
                    quality = "128kbps";
                    break;
                case "141":
                    quality = "256kbps";
                    break;
            }
            if (quality) {
                streamsObject[quality] = streamObject.url;
                quality = false;
            }
        }
        return streamsObject;
    }

    , getBiggerThumbnailUrl: (thumbnails) => {
       let thumbnail = Math.max.apply(Math, thumbnails.map(thumbnail => thumbnail.height));
       return thumbnail.url;
    }
};

export default AudioExtractor;
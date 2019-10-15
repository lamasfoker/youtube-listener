"use strict";

const StreamQuality = {
    getStreamUrl: (streams) => {
        let qualities = ["256kbps", "128kbps", "48kbps"],
            quality;
        if (StreamQuality.getStreamQuality() === StreamQuality.low) {
            qualities = qualities.reverse();
        }
        for (quality of qualities) {
            if (streams.hasOwnProperty(quality)) {
                return streams[quality];
            }
        }
        throw "I can't find the audio of this video";
    }

    , high: "high"

    , low: "low"

    , key: "youtube_audio_quality"

    , changeStreamQuality: () => {
        let quality = StreamQuality.high;
        if (StreamQuality.getStreamQuality() === StreamQuality.high) {
            quality = StreamQuality.low;
        }
        StreamQuality.setStreamQuality(quality);
    }

    , getStreamQuality: () => {
        if (localStorage.getItem(StreamQuality.key) === null) {
            StreamQuality.setStreamQuality(StreamQuality.high);
        }
        return localStorage.getItem(StreamQuality.key);
    }

    , setStreamQuality: (quality) => {
        localStorage.setItem(StreamQuality.key, quality);
    }
};

export default StreamQuality
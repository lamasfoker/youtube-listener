"use strict";

import CompatibilityChecker from "./service/CompatibilityChecker.js";
import YouTubeRequest from "./service/YouTubeRequest.js";
import AudioExtractor from "./service/AudioExtractor.js";
import StreamQuality from "./service/StreamQuality.js";

document.addEventListener("DOMContentLoaded", async () => {
    CompatibilityChecker.check();
    await navigator.serviceWorker.register("./ServiceWorker.js");
    const progressBar = document.querySelector("#song-played-progress");
    const qualityToggle = document.querySelector("#toggle");
    let audio;

    if (StreamQuality.getStreamQuality() === StreamQuality.high) {
        qualityToggle.checked = true;
    }
    qualityToggle.onclick = StreamQuality.changeStreamQuality;

    try {
        let body = await YouTubeRequest.getBody();
        audio = AudioExtractor.extract(body);
    } catch (e) {
        audio = {
            "title": "Share me a YouTube video",
            "author": "Remember: I can't reproduce music video and other one with copyright",
            "streams": {
                "128kbps": "assets/sounds/failed.mp4"
            },
            "thumbnailUrl": "assets/images/404.jpeg"
        }
    }

    Amplitude.init({
        "bindings": {
            37: 'prev',
            39: 'next',
            32: 'play_pause'
        },
        "songs": [
            {
                "name": audio.title,
                "artist": audio.author,
                "url": StreamQuality.getStreamUrl(audio.streams),
                "cover_art_url": audio.thumbnailUrl
            }
        ]
    });

    progressBar.addEventListener('click', function (e) {
        let offset = this.getBoundingClientRect(),
            cursor = e.x - offset.left;
        Amplitude.setSongPlayedPercentage((parseFloat(cursor) / parseFloat(this.offsetWidth)) * 100);
    });
});

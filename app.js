"use strict";

import CompatibilityChecker from "./service/CompatibilityChecker.js";
import YouTubeRequest from "./service/YouTubeRequest.js";
import AudioExtractor from "./service/AudioExtractor.js";
import StreamQuality from "./service/StreamQuality.js";

document.addEventListener("DOMContentLoaded", async () => {
    const screen = document.querySelector("html");
    screen.style.visibility = "hidden";
    try {
        CompatibilityChecker.checkServiceWorker();
    } catch (e) {
        return alert(e);
    }
    await navigator.serviceWorker.register("./ServiceWorker.js");
    const progressBar = document.querySelector("#song-played-progress");
    const qualityToggle = document.querySelector("#toggle");
    let audio;

    if (StreamQuality.getStreamQuality() === StreamQuality.high) {
        qualityToggle.checked = true;
    }
    qualityToggle.onclick = StreamQuality.changeStreamQuality;

    try {
        CompatibilityChecker.checkStandaloneMode();
        let body = await YouTubeRequest.getBody();
        audio = AudioExtractor.extract(body);
    } catch (e) {
        audio = {
            "title": e,
            "author": "Author of the App: LamasFoker",
            "streams": {
                "128kbps": "assets/sounds/failed.mp4"
            },
            "thumbnailUrl": "assets/images/404.jpeg"
        }
    }

    Amplitude.init({
        "bindings": {
            37: "prev",
            39: "next",
            32: "play_pause"
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

    progressBar.addEventListener("click", function (e) {
        let offset = this.getBoundingClientRect(),
            cursor = e.x - offset.left;
        Amplitude.setSongPlayedPercentage((parseFloat(cursor) / parseFloat(this.offsetWidth)) * 100);
    });
    screen.style.visibility = "visible";
});

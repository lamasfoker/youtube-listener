"use strict";

import CompatibilityChecker from "./service/CompatibilityChecker.js";
import YouTubeRequest from "./service/YouTubeRequest.js";
import AudioExtractor from "./service/AudioExtractor.js";

document.addEventListener("DOMContentLoaded", async () => {
    CompatibilityChecker.check();
    await navigator.serviceWorker.register("./ServiceWorker.js");
    const progressBar = document.querySelector("#song-played-progress");

    let body = await YouTubeRequest.getBody();
    let audio = AudioExtractor.extract(body);

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
                "url": audio.streams["128kbps"],
                "cover_art_url": audio.thumbnailUrl
            }
        ]
    });

    progressBar.addEventListener('click', function (e) {
        let offset = this.getBoundingClientRect(),
            x = e.x - offset.left;
        Amplitude.setSongPlayedPercentage((parseFloat(x) / parseFloat(this.offsetWidth)) * 100);
    });
});

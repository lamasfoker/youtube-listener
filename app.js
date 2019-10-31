"use strict";

import CompatibilityChecker from "./service/CompatibilityChecker.js";
import YouTubeRequest from "./service/YouTubeRequest.js";
import AudioExtractor from "./service/AudioExtractor.js";
import StreamQuality from "./service/StreamQuality.js";
import TimeFormatter from "./service/TimeFormatter.js";

document.addEventListener("DOMContentLoaded", async () => {
    try {
        CompatibilityChecker.checkServiceWorker();
    } catch (e) {
        return alert(e);
    }
    await navigator.serviceWorker.register("./ServiceWorker.js");
    const progressBar = document.querySelector(".song-played-progress");
    const qualityToggle = document.querySelector("#toggle");
    const playerButton = document.querySelector(".play-pause");
    const currentTime = document.querySelector(".current-time");
    const changePlayerButtonStatus = () => {
        if (playerButton.classList.contains('paused')) {
            playerButton.classList.add("playing");
            playerButton.classList.remove("paused");
        } else {
            playerButton.classList.add("paused");
            playerButton.classList.remove("playing");
        }
    };
    const updateProgressBar = () => {
        let seek = sound.seek();
        currentTime.innerHTML = TimeFormatter.format(seek);
        progressBar.value = seek / sound.duration();
    };
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

    document.querySelector(".song-name").innerHTML = audio.title;
    document.querySelector(".song-author").innerHTML = audio.author;
    document.querySelector(".thumbnail").src = audio.thumbnailUrl;

    const sound = new Howl({
        src: StreamQuality.getStreamUrl(audio.streams),
        html5: true,
        preload: true,
        onload: () => {
            document.querySelector(".duration").innerHTML = TimeFormatter.format(sound.duration());
            setInterval(updateProgressBar, 100);
        },
        onplay: () => {
            changePlayerButtonStatus();
        },
        onend: () => {
            changePlayerButtonStatus();
        },
        onpause: () => {
            changePlayerButtonStatus();
        }
    });

    playerButton.onclick = () => {
        if (sound.playing()) {
            sound.pause();
        } else {
            sound.play();
        }
    };

    progressBar.onclick = (e) => {
        let offset = progressBar.getBoundingClientRect(),
            cursor = e.x - offset.left,
            seek = parseFloat(cursor) / parseFloat(progressBar.offsetWidth);
        sound.seek(seek * sound.duration());
    };
});

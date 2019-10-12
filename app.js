"use strict";

import CompatibilityChecker from "./service/CompatibilityChecker.js";
import YouTubeRequest from "./service/YouTubeRequest.js";
import AudioExtractor from "./service/AudioExtractor.js";

document.addEventListener("DOMContentLoaded", async () => {
    CompatibilityChecker.check();
    await navigator.serviceWorker.register("./ServiceWorker.js");
    const audioTag = document.querySelector("#youtube");
    const title = document.querySelector(".title");

    let body = await YouTubeRequest.getBody();
    let audio = AudioExtractor.extract(body);

    audioTag.src = audio.streams["128kbps"];
    title.innerHTML = audio.title;

    document.body.addEventListener("touchend", () => audioTag.play(), {once: true});
});

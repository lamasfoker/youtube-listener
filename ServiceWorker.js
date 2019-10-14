const cacheName = "youtubelistener",
    filesToCache = [
        "/youtubelistener/",
        "/youtubelistener/index.html",
        "/youtubelistener/assets/css/style.css",
        "/youtubelistener/app.js",
        "/youtubelistener/service/CompatibilityChecker.js",
        "/youtubelistener/service/StringParser.js",
        "/youtubelistener/service/YouTubeRequest.js",
        "/youtubelistener/service/AudioExtractor.js",
        "/youtubelistener/service/StreamQuality.js",
        "/youtubelistener/assets/images/pause.svg",
        "/youtubelistener/assets/images/play.svg",
        "/youtubelistener/assets/images/404.jpeg",
        "/youtubelistener/assets/sounds/failed.mp4"
    ];

self.addEventListener("install", function (e) {
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener("fetch", function (e) {
    e.respondWith(
        caches.match(e.request).then(function (response) {
            return response || fetch(e.request);
        })
    );
});

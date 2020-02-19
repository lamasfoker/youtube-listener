const cacheName = "youtube-listener",
    filesToCache = [
        "/youtube-listener/",
        "/youtube-listener/index.html",
        "/youtube-listener/assets/css/style.css",
        "/youtube-listener/app.js",
        "/youtube-listener/service/CompatibilityChecker.js",
        "/youtube-listener/service/StringParser.js",
        "/youtube-listener/service/YouTubeRequest.js",
        "/youtube-listener/service/AudioExtractor.js",
        "/youtube-listener/service/StreamQuality.js",
        "/youtube-listener/assets/images/pause.svg",
        "/youtube-listener/assets/images/play.svg",
        "/youtube-listener/assets/images/404.jpeg",
        "/youtube-listener/assets/sounds/failed.mp4"
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

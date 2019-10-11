window.onload = async () => {
    'use strict';

    if ('serviceWorker' in navigator) {
        await navigator.serviceWorker.register('./sw.js');
        const audioTag = document.getElementById('youtube');
        let url = new URL(window.location.href.toString()),
            youtubeUrl,
            videoId,
            audioStreams = {};

        if (!url.searchParams.get('text')) {
            return;
        }
        youtubeUrl = new URL(url.searchParams.get('text'));
        videoId = youtubeUrl.pathname.substr(1);

        let apiUrl = "https://" + videoId + "-focus-opensocial.googleusercontent.com/gadgets/proxy?container=none&url=https%3A%2F%2Fwww.youtube.com%2Fget_video_info%3Fvideo_id%3D" + videoId;

        let response = await fetch(apiUrl, {
            method: 'GET'
        });

        if (response.ok) {
            let body = await response.text(),
                dataArray = parse_str(body),
                videoDetails = JSON.parse(dataArray.player_response).videoDetails,
                videoTitle = videoDetails.title,
                videoAuthor = videoDetails.author,
                videoThumbnails = videoDetails.thumbnail.thumbnails;
            if (!dataArray.hasOwnProperty("url_encoded_fmt_stream_map") || !dataArray.hasOwnProperty("adaptive_fmts")) {
                console.log('I can\'t play song video or other property one');
                return;
            }
            let streams = (dataArray.url_encoded_fmt_stream_map + ',' + dataArray.adaptive_fmts).split(',');
            let streamObject = {},
                quality = false,
                stream;
            for (stream of streams) {
                streamObject = parse_str(stream);
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
                    audioStreams[quality] = streamObject.url;
                }
            }
            audioTag.src = audioStreams['128kbps'];

            const isMobile = navigator.maxTouchPoints || "ontouchstart" in document.documentElement;

            function play() {
                audioTag.play()
            }
            document.body.addEventListener(isMobile ? "touchend" : "click", play, {once: true});
        }

        function parse_str(str) {
            return str.split('&').reduce(function (params, param) {
                let paramSplit = param.split('=').map(function (value) {
                    return decodeURIComponent(value.replace('+', ' '));
                });
                params[paramSplit[0]] = paramSplit[1];
                return params;
            }, {});
        }
    }
};

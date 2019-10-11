window.onload = async () => {
    'use strict';

    if ('serviceWorker' in navigator) {
        await navigator.serviceWorker.register('./sw.js');
        const audioTag = document.getElementById('youtube');
        let url = new URL(window.location.href.toString()),
            youtubeUrl,
            videoId,
            audioStreams = {};

        if (!url.searchParams.get('url')) {
            return;
        }
        youtubeUrl = new URL(url.searchParams.get('url'));
        videoId = youtubeUrl.pathname.substr(1);

        let apiUrl = "https://" + videoId + "-focus-opensocial.googleusercontent.com/gadgets/proxy?container=none&url=https%3A%2F%2Fwww.youtube.com%2Fget_video_info%3Fvideo_id%3D" + videoId;

        let response = await fetch(apiUrl, {
            method: 'GET'
        });

        if (response.ok) {
            response.text().then(data => {

                data = parse_str(data);
                let streams = (data.url_encoded_fmt_stream_map + ',' + data.adaptive_fmts).split(',');

                streams.forEach(function (s, n) {
                    let stream = parse_str(s),
                        itag = stream.itag * 1,
                        quality = false;
                    switch (itag) {
                        case 139:
                            quality = "48kbps";
                            break;
                        case 140:
                            quality = "128kbps";
                            break;
                        case 141:
                            quality = "256kbps";
                            break;
                    }
                    if (quality) {
                        audioStreams[quality] = stream.url;
                    }
                });

                audioTag.src = audioStreams['128kbps'];
                audioTag.play();
            })
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

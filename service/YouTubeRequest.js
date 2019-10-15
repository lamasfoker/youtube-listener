"use strict";

const YouTubeRequest = {
    getBody: async () => {
        let videoId = YouTubeRequest.getVideoId(),
            apiUrl = "https://" + videoId + "-focus-opensocial.googleusercontent.com/gadgets/proxy?container=none&url=https%3A%2F%2Fwww.youtube.com%2Fget_video_info%3Fvideo_id%3D" + videoId;

        let response = await fetch(apiUrl, {
            method: "GET"
        });

        if (!response.ok) {
            throw "Error with YouTube server"
        }

        return await response.text();
    }

    , getVideoId: () => {
        let currentUrl = new URL(window.location.href);
        if (!currentUrl.searchParams.get("text")) {
            throw "Share me a youtube video to listen in background";
        }
        let youtubeUrl = new URL(currentUrl.searchParams.get("text"));
        return youtubeUrl.pathname.substr(1)
    }
};

export default YouTubeRequest;
"use strict";

const TimeFormatter = {
    format: (duration) => {
        duration = Math.floor(duration);
        let hours = Math.floor(duration / 3600);
        let minutes = Math.floor((duration - hours * 3600) / 60);
        let seconds = duration - hours * 3600 - minutes * 60;
        let formated = String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
        if (hours > 0) {
            formated = String(hours).padStart(2, "0") + ":" + duration;
        }
        return formated;
    }
};

export default TimeFormatter;

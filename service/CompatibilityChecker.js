"use strict";

const CompatibilityChecker = {
    check: () => {
        if (!('serviceWorker' in navigator)) {
            throw 'Service workers are not supported by this browser';
        }

        if (!(navigator.maxTouchPoints || "ontouchstart" in document.documentElement)) {
            throw 'This is not a Smartphone';
        }
    }
};

export default CompatibilityChecker;
"use strict";

const CompatibilityChecker = {
    checkServiceWorker: () => {
        if (!("serviceWorker" in navigator)) {
            throw "Service workers are not supported by this browser";
        }
    }

    , checkStandaloneMode: () => {
        if (!(navigator.maxTouchPoints || "ontouchstart" in document.documentElement)) {
            throw "I can run only on Android";
        }

        if (!window.matchMedia("(display-mode: standalone)").matches) {
            throw "You have to add me to the Homescreen";
        }
    }
};

export default CompatibilityChecker;
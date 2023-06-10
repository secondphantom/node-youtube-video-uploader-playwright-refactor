"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PlaywrightVideo {
    playwrightInstance;
    static instance;
    static getInstance = (playwrightInstance) => {
        if (this.instance)
            return this.instance;
        this.instance = new PlaywrightVideo(playwrightInstance);
        return this.instance;
    };
    constructor(playwrightInstance) {
        this.playwrightInstance = playwrightInstance;
    }
}
//# sourceMappingURL=playwright.upload.js.map
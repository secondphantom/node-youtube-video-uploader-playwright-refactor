"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoService = void 0;
class VideoService {
    browserInstance;
    static instance;
    static getInstance = (browserInstance) => {
        if (this.instance)
            return this.instance;
        this.instance = new VideoService(browserInstance);
        return this.instance;
    };
    constructor(browserInstance) {
        this.browserInstance = browserInstance;
    }
    uploadVideo = async (dto) => {
        const result = await this.browserInstance.uploadVideo(dto);
        return result;
    };
}
exports.VideoService = VideoService;

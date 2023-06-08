"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoService = void 0;
class VideoService {
    static instance;
    static getInstance = () => {
        if (this.instance)
            return this.instance;
        this.instance = new VideoService();
        return this.instance;
    };
    uploadVideo = () => { };
    deleteVideo = () => { };
    updateVideo = () => { };
}
exports.VideoService = VideoService;
//# sourceMappingURL=video.service.js.map
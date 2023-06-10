"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoService = void 0;
const response_dto_1 = require("../dto/response.dto");
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
        try {
            const result = await this.browserInstance.uploadVideo(dto);
            return new response_dto_1.ResponseDto({
                payload: {
                    success: true,
                    data: result,
                },
            });
        }
        catch (error) {
            return new response_dto_1.ResponseDto({
                payload: {
                    success: false,
                    data: {
                        message: error.message,
                    },
                },
            });
        }
    };
}
exports.VideoService = VideoService;
//# sourceMappingURL=video.service.js.map
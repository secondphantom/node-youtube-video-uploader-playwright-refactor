"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoController = void 0;
const response_dto_1 = require("../../application/dto/response.dto");
class VideoController {
    videoService;
    static instance;
    static getInstance = (videoService) => {
        if (this.instance)
            return this.instance;
        this.instance = new VideoController(videoService);
        return this.instance;
    };
    constructor(videoService) {
        this.videoService = videoService;
    }
    uploadVideo = async (dto) => {
        try {
            const result = await this.videoService.uploadVideo(dto);
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
exports.VideoController = VideoController;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoValidatorController = void 0;
const response_dto_1 = require("../../application/dto/response.dto");
class VideoValidatorController {
    videoValidator;
    videoController;
    static instance;
    constructor(videoValidator, videoController) {
        this.videoValidator = videoValidator;
        this.videoController = videoController;
    }
    static getInstance = (videoValidator, videoController) => {
        if (this.instance)
            return this.instance;
        this.instance = new VideoValidatorController(videoValidator, videoController);
        return this.instance;
    };
    uploadVideo = async (dto) => {
        try {
            const validDto = this.videoValidator.uploadVideo(dto);
            const result = await this.videoController.uploadVideo(validDto);
            return result;
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
exports.VideoValidatorController = VideoValidatorController;
//# sourceMappingURL=video.validator.js.map
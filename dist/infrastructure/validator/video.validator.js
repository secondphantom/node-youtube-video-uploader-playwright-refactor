"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoValidator = void 0;
const zod_1 = __importDefault(require("zod"));
const zod_validation_error_1 = require("zod-validation-error");
class VideoValidator {
    static instance;
    static getInstance = () => {
        if (this.instance)
            return this.instance;
        this.instance = new VideoValidator();
        return this.instance;
    };
    videoFileSchema = zod_1.default.object({
        video: zod_1.default.string(),
        thumbnail: zod_1.default.string().optional(),
    });
    videoMetaSchema = zod_1.default.object({
        title: zod_1.default.string(),
        description: zod_1.default.string().optional(),
        tags: zod_1.default.array(zod_1.default.string()).optional(),
        playlist: zod_1.default.array(zod_1.default.string()).optional(),
    });
    uploadConfigSchema = zod_1.default
        .object({
        visibility: zod_1.default
            .union([
            zod_1.default.literal("public"),
            zod_1.default.literal("unlisted"),
            zod_1.default.literal("private"),
            zod_1.default.literal("schedule"),
        ])
            .optional(),
        schedule: zod_1.default.date().optional(),
        notifySubscribers: zod_1.default.boolean().optional(),
    })
        .optional();
    uploadVideoDto = zod_1.default.object({
        filePath: this.videoFileSchema,
        meta: this.videoMetaSchema,
        config: this.uploadConfigSchema,
    });
    uploadVideo = (dto) => {
        try {
            const result = this.uploadVideoDto.parse(dto);
            return result;
        }
        catch (error) {
            const validationError = (0, zod_validation_error_1.fromZodError)(error);
            throw new Error(validationError.message);
        }
    };
}
exports.VideoValidator = VideoValidator;
//# sourceMappingURL=video.validator.js.map
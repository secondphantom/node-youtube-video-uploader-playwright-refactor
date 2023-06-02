"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = void 0;
const zod_1 = require("zod");
class Validator {
    static instance;
    static getInstance = () => {
        if (this.instance)
            return this.instance;
        this.instance = new Validator();
        return this.instance;
    };
    // upload video
    videoSchema = zod_1.z.object({
        videoPath: zod_1.z.string(),
        title: zod_1.z.string(),
        description: zod_1.z.string().optional(),
        thumbnailPath: zod_1.z.string().optional(),
        playlist: zod_1.z.array(zod_1.z.string()).optional(),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
    });
    uploadSchema = zod_1.z
        .object({
        visibility: zod_1.z
            .union([
            zod_1.z.literal("public"),
            zod_1.z.literal("unlisted"),
            zod_1.z.literal("private"),
        ])
            .optional(),
        schedule: zod_1.z.date().optional(),
    })
        .optional();
    uploadVideo = (dto) => {
        const video = this.videoSchema.parse(dto.video);
        const upload = this.uploadSchema.parse(dto.upload);
        return {
            video,
            upload,
        };
    };
    // comment at video
    commentSchema = zod_1.z.object({
        videoId: zod_1.z.string(),
        comment: zod_1.z.string(),
        isPin: zod_1.z.boolean().optional(),
    });
    commentAtVideo = (dto) => {
        const result = this.commentSchema.parse(dto);
        return result;
    };
}
exports.Validator = Validator;
//# sourceMappingURL=validator.js.map
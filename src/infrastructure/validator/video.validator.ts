import {
  UploadVideoDto,
  VideoFileSchema,
} from "../../application/interfaces/browser.instance";
import { VideoValidatorInterface } from "../../controller/video/video.interface";
import z from "zod";
import { fromZodError } from "zod-validation-error";

export class VideoValidator implements VideoValidatorInterface {
  static instance: VideoValidator | undefined;
  static getInstance = () => {
    if (this.instance) return this.instance;
    this.instance = new VideoValidator();
    return this.instance;
  };

  private videoFileSchema = z.object({
    video: z.string(),
    thumbnail: z.string().optional(),
  });
  private videoMetaSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    playlist: z.array(z.string()).optional(),
  });
  private uploadConfigSchema = z
    .object({
      visibility: z
        .union([
          z.literal("public"),
          z.literal("unlisted"),
          z.literal("private"),
          z.literal("schedule"),
        ])
        .optional(),
      schedule: z
        .date()
        .transform((val, ctx) => {
          if (val.getTime() < new Date().getTime()) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Need schedule date in the future",
            });
            return z.NEVER;
          }
          return val;
        })
        .optional(),
      notifySubscribers: z.boolean().optional(),
    })
    .optional();

  private uploadVideoDto = z.object({
    filePath: this.videoFileSchema,
    meta: this.videoMetaSchema,
    config: this.uploadConfigSchema,
  });

  uploadVideo = (dto: UploadVideoDto) => {
    try {
      const result = this.uploadVideoDto.parse(dto);
      return result;
    } catch (error: any) {
      const validationError = fromZodError(error);
      throw new Error(validationError.message);
    }
  };
}

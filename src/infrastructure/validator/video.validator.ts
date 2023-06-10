import {
  UploadVideoDto,
  VideoFileSchema,
} from "../../application/interfaces/browser.instance";
import { VideoValidatorInterface } from "../../controller/video/video.interface";
import z from "zod";

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
      schedule: z.date().optional(),
      notifySubscribers: z.boolean().optional(),
    })
    .optional();

  private uploadVideoDto = z.object({
    filePath: this.videoFileSchema,
    meta: this.videoMetaSchema,
    config: this.uploadConfigSchema,
  });

  uploadVideo = (dto: UploadVideoDto) => {
    return this.uploadVideoDto.parse(dto);
  };
}

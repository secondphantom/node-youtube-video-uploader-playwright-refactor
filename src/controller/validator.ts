import { z } from "zod";

// export type UploadVideoInput = {
//   videoPath: string;
//   thumbnailPath?: string;
//   title: string;
//   description?: string;
//   playlist?: string[];
//   tags?: string[];
// } & (
//   | {
//       visibility?: "public" | "unlisted" | "private";
//       schedule?: never;
//     }
//   | {
//       visibility?: never;
//       schedule?: Date;
//     }
// );

type VideoSchema = {
  videoPath: string;
  title: string;
  description?: string;
  thumbnailPath?: string;
  playlist?: string[];
  tags?: string[];
};

type UploadSchema =
  | {
      visibility?: "public" | "unlisted" | "private";
      schedule?: never;
    }
  | {
      visibility?: never;
      schedule?: Date;
    };

type CommentSchema = {
  videoId: string;
  comment: string;
  isPin?: boolean;
};

type UploadVideoInput = {
  video: VideoSchema;
  upload?: UploadSchema;
};

export class Validator {
  static instance: Validator | undefined;

  static getInstance = () => {
    if (this.instance) return this.instance;
    this.instance = new Validator();
    return this.instance;
  };

  // upload video
  private videoSchema = z.object({
    videoPath: z.string(),
    title: z.string(),
    description: z.string().optional(),
    thumbnailPath: z.string().optional(),
    playlist: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
  });

  private uploadSchema = z
    .object({
      visibility: z
        .union([
          z.literal("public"),
          z.literal("unlisted"),
          z.literal("private"),
        ])
        .optional(),
      schedule: z.date().optional(),
    })
    .optional();

  uploadVideo = (dto: UploadVideoInput) => {
    const video = this.videoSchema.parse(dto.video);
    const upload = this.uploadSchema.parse(dto.upload);

    return {
      video,
      upload,
    };
  };

  // comment at video
  private commentSchema = z.object({
    videoId: z.string(),
    comment: z.string(),
    isPin: z.boolean().optional(),
  });

  commentAtVideo = (dto: CommentSchema) => {
    const result = this.commentSchema.parse(dto);

    return result;
  };

  // update video
}

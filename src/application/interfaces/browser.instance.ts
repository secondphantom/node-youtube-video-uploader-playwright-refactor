import { Page } from "playwright";

export interface UploadConfig {
  config?: {
    visibility?: "public" | "unlisted" | "private" | "schedule";
    schedule?: Date;
    notifySubscribers?: boolean;
  };
}

export interface VideoFileSchema {
  filePath: {
    video: string;
    thumbnail?: string;
  };
}

export interface VideoMetaSchema {
  meta: {
    title: string;
    description?: string;
    tags?: string[];
    playlist?: string[];
  };
}

export interface VideoIdSchema {
  videoId: string;
}

export interface CommentSchema {
  comment: string;
  isPin?: boolean;
}

export type UploadVideoDto = VideoFileSchema & VideoMetaSchema & UploadConfig;
export type DeleteVideoDto = VideoIdSchema;
export type UpdateVideoDto = VideoMetaSchema & VideoIdSchema;
export type WriteCommentDto = CommentSchema & VideoIdSchema;

export abstract class BrowserInstance {
  abstract launch: () => Promise<void>;
  abstract goLoginPage: () => Promise<Page>;

  abstract uploadVideo: (dto: UploadVideoDto) => Promise<VideoIdSchema>;
  // abstract deleteVideo: (dto: DeleteVideoDto) => Promise<void>;
  // abstract updateVideo: (dto: UpdateVideoDto) => Promise<void>;

  // abstract writeComment: (dto: WriteCommentDto) => Promise<void>;
}

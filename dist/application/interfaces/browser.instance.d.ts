import { Cookie, Page } from "playwright";
export interface UploadConfig {
    config?: {
        visibility: "public" | "unlisted" | "private";
    } | {
        schedule: Date;
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
export type LaunchDto = {
    cookies: Cookie[];
};
export declare abstract class BrowserInstance {
    abstract launch: (dto: LaunchDto) => Promise<void>;
    abstract goLoginPage: () => Promise<Page>;
    abstract getCookie: () => Promise<Cookie[]>;
}

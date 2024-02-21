import { LaunchOptions, Page } from "playwright";
export type PageType = "video" | "comment";
export interface GetInstanceInput {
    channelId: string;
    authFilePath: string;
    youtubeLocale: string;
    pages?: PageType[];
    launchOptions?: LaunchOptions;
}
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
export type ReloadPageDto = {
    page: PageType;
};
export declare abstract class BrowserInstance {
    get channelId(): string;
    abstract launch: () => Promise<void>;
    abstract reloadPage: (dto: ReloadPageDto) => Promise<void>;
    abstract saveAuthFile: () => Promise<void>;
    abstract goLoginPage: () => Promise<Page>;
    abstract goSwitchPage: () => Promise<Page>;
    abstract uploadVideo: (dto: UploadVideoDto) => Promise<VideoIdSchema>;
}

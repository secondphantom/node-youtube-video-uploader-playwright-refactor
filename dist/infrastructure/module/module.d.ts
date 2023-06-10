import { LaunchOptions } from "playwright";
import { UploadVideoDto, VideoIdSchema } from "../../application/interfaces/browser.instance";
export interface YoutubeUtilConfig {
    cookiesFilePath: string;
    channelId: string;
    youtubeLocale: string;
    pages?: ("video" | "comment")[];
    launchOptions?: LaunchOptions;
}
export declare class YoutubeUtil {
    private LoginController;
    private VideoController;
    constructor(config: YoutubeUtilConfig);
    login: () => Promise<{
        isLogin: boolean;
    }>;
    uploadVideo: (dto: UploadVideoDto) => Promise<VideoIdSchema>;
    private responseResolver;
}

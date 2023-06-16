import { LaunchOptions } from "playwright";
import { UploadVideoDto, VideoIdSchema } from "../../application/interfaces/browser.instance";
export interface YoutubeUtilConfig {
    userDataDir: string;
    channelId: string;
    youtubeLocale: string;
    pages?: ("video" | "comment")[];
    launchOptions?: LaunchOptions;
}
export declare class YoutubeUtil {
    private LoginController;
    private VideoController;
    private browserInstance;
    constructor(config: YoutubeUtilConfig);
    login: () => Promise<{
        isLogin: boolean;
    }>;
    uploadVideo: (dto: UploadVideoDto) => Promise<VideoIdSchema>;
    get pageObj(): {
        video: {
            page: import("playwright-core").Page | undefined;
            isBusy: boolean;
        };
        comment: {
            page: import("playwright-core").Page | undefined;
            isBusy: boolean;
        };
    };
    private responseResolver;
}

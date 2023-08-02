import { GetInstanceInput, UploadVideoDto, VideoIdSchema } from "../../application/interfaces/browser.instance";
export type YoutubeUtilConfig = GetInstanceInput;
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

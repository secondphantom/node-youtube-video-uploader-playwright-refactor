import { Cookie, LaunchOptions, Page } from "playwright";
import { BrowserInstance, LaunchDto, UploadVideoDto } from "../../application/interfaces/browser.instance";
export declare class PlaywrightInstance extends BrowserInstance {
    private channelId;
    private youtubeLocale;
    private launchOptions;
    static instance: PlaywrightInstance | undefined;
    static getInstance: (channelId: string, youtubeLocale: string, launchOptions: LaunchOptions) => PlaywrightInstance;
    private browserContext;
    private pageObj;
    constructor(channelId: string, youtubeLocale: string, launchOptions: LaunchOptions);
    goLoginPage: () => Promise<Page>;
    getCookie: () => Promise<Cookie[]>;
    launch: (dto: LaunchDto) => Promise<void>;
    uploadVideo: (dto: UploadVideoDto) => Promise<{
        videoId: string;
    }>;
    private goto;
    private checkValidLogin;
    private openBrowser;
    private closeBrowser;
    private openPage;
    private browserLaunchCheck;
    existFill: ({ page, querySelector, inputStr, delayMs, maxTryCount, }: {
        page: Page;
        querySelector: string;
        inputStr: string;
        delayMs?: number | undefined;
        maxTryCount?: number | undefined;
    }) => Promise<void>;
    existClick: ({ page, querySelector, delayMs, maxTryCount, throwError, }: {
        page: Page;
        querySelector: string;
        delayMs?: number | undefined;
        maxTryCount?: number | undefined;
        throwError?: boolean | undefined;
    }) => Promise<void>;
    fileChoose: ({ page, querySelector, filePath, }: {
        page: Page;
        querySelector: string;
        filePath: string;
    }) => Promise<void>;
    getYoutubeLocale: () => string;
}

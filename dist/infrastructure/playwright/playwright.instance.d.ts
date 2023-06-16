import { LaunchOptions, Page } from "playwright";
import { BrowserInstance, UploadVideoDto } from "../../application/interfaces/browser.instance";
export declare class PlaywrightInstance extends BrowserInstance {
    private channelId;
    private userDataDir;
    private youtubeLocale;
    private pages;
    private launchOptions?;
    static instance: PlaywrightInstance | undefined;
    static getInstance: ({ channelId, userDataDir, youtubeLocale, pages, launchOptions, }: {
        channelId: string;
        userDataDir: string;
        youtubeLocale: string;
        pages?: ("video" | "comment")[] | undefined;
        launchOptions?: LaunchOptions | undefined;
    }) => PlaywrightInstance;
    private browserContext;
    private _pageObj;
    get pageObj(): {
        video: {
            page: Page | undefined;
            isBusy: boolean;
        };
        comment: {
            page: Page | undefined;
            isBusy: boolean;
        };
    };
    constructor(channelId: string, userDataDir: string, youtubeLocale: string, pages: ("video" | "comment")[], launchOptions?: LaunchOptions | undefined);
    goLoginPage: () => Promise<Page>;
    launch: () => Promise<void>;
    uploadVideo: (dto: UploadVideoDto) => Promise<{
        videoId: string;
    }>;
    private goto;
    checkValidLogin: () => Promise<void>;
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

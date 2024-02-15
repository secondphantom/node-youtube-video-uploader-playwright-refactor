import { Page } from "playwright";
import { BrowserInstance, GetInstanceInput, ReloadPageDto, UploadVideoDto } from "../../application/interfaces/browser.instance";
export declare class PlaywrightInstance extends BrowserInstance {
    static instance: PlaywrightInstance | undefined;
    static getInstance: (instanceInput: GetInstanceInput) => PlaywrightInstance;
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
    private _channelId;
    private authFilePath;
    private youtubeLocale;
    private pages;
    private launchOptions;
    constructor({ channelId, authFilePath, youtubeLocale, pages, launchOptions, }: Required<GetInstanceInput>);
    get channelId(): string;
    goLoginPage: () => Promise<Page>;
    launch: () => Promise<void>;
    uploadVideo: (dto: UploadVideoDto) => Promise<{
        videoId: string;
    }>;
    private goto;
    private delay;
    checkValidLogin: () => Promise<void>;
    private openBrowser;
    private closeBrowser;
    private openPage;
    reloadPage: (dto: ReloadPageDto) => Promise<void>;
    private browserLaunchCheck;
    private getAuth;
    saveAuthFile: () => Promise<void>;
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

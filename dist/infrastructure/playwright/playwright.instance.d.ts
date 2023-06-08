import { Cookie, LaunchOptions, Page } from "playwright";
import { BrowserInstance, LaunchDto } from "../../application/interfaces/browser.instance";
export declare class PlaywrightInstance extends BrowserInstance {
    private channelId;
    private launchOptions;
    static instance: PlaywrightInstance | undefined;
    static getInstance: (channelId: string, launchOptions: LaunchOptions) => PlaywrightInstance;
    private browserContext;
    private pageObj;
    constructor(channelId: string, launchOptions: LaunchOptions);
    goto: (url: string, page: Page) => Promise<void>;
    goLoginPage: () => Promise<Page>;
    getCookie: () => Promise<Cookie[]>;
    launch: (dto: LaunchDto) => Promise<void>;
    checkValidLogin: () => Promise<void>;
    openBrowser: () => Promise<void>;
    closeBrowser: () => Promise<void>;
    openPage: () => Promise<Page>;
    private browserLaunchCheck;
}

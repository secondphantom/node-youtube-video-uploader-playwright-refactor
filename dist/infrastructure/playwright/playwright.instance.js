"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaywrightInstance = void 0;
const playwright_1 = require("playwright");
const browser_instance_1 = require("../../application/interfaces/browser.instance");
class PlaywrightInstance extends browser_instance_1.BrowserInstance {
    channelId;
    launchOptions;
    static instance;
    static getInstance = (channelId, launchOptions) => {
        if (this.instance)
            return this.instance;
        this.instance = new PlaywrightInstance(channelId, launchOptions);
        return this.instance;
    };
    browserContext;
    pageObj = {
        video: {
            page: undefined,
            isBusy: false,
        },
        comment: {
            page: undefined,
            isBusy: false,
        },
    };
    constructor(channelId, launchOptions) {
        super();
        this.channelId = channelId;
        this.launchOptions = launchOptions;
    }
    goto = async (url, page) => {
        await page.goto(url, { waitUntil: "load" });
    };
    goLoginPage = async () => {
        await this.openBrowser();
        const page = await this.openPage();
        await this.goto(`https://studio.youtube.com/channel/UC${this.channelId}`, page);
        return page;
    };
    getCookie = async () => {
        this.browserLaunchCheck();
        const cookies = await this.browserContext.cookies("https://www.youtube.com");
        return cookies;
    };
    launch = async (dto) => {
        await this.closeBrowser();
        const { cookies } = dto;
        await this.openBrowser();
        await this.browserContext.addCookies(cookies);
        await this.checkValidLogin();
        for (const pageKey in this.pageObj) {
            console.log(pageKey);
            //@ts-ignore
            this.pageObj[pageKey].page = await this.browserContext.newPage();
        }
    };
    checkValidLogin = async () => {
        const page = await this.openPage();
        await this.goto(`https://studio.youtube.com/channel/UC${this.channelId}`, page);
        const pageUrl = page.url();
        await page.close();
        if (pageUrl.includes("https://accounts.google.com/v3/signin")) {
            throw new Error(`[ERROR] BrowserInstance: LOGIN REQUIRED`);
        }
    };
    openBrowser = async () => {
        if (this.browserContext)
            return;
        const browser = await playwright_1.chromium.launch(this.launchOptions);
        this.browserContext = await browser.newContext();
    };
    closeBrowser = async () => {
        if (!this.browserContext)
            return;
        this.browserContext.close();
        this.browserContext = undefined;
    };
    openPage = async () => {
        this.browserLaunchCheck();
        const page = this.browserContext.newPage();
        return page;
    };
    browserLaunchCheck = () => {
        if (!this.browserContext) {
            throw new Error(`[ERROR] Browser Instance: Browser Not Launched`);
        }
    };
}
exports.PlaywrightInstance = PlaywrightInstance;
//# sourceMappingURL=playwright.instance.js.map
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
        this.launchOptions = {
            ignoreDefaultArgs: [
                "--disable-component-extensions-with-background-pages",
            ],
            args: ["--disable-blink-features=AutomationControlled"],
            ...launchOptions,
        };
    }
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
            const page = await this.browserContext.newPage();
            //@ts-ignore
            this.pageObj[pageKey].page = page;
            this.goto(`https://studio.youtube.com/channel/UC${this.channelId}`, page);
        }
    };
    goto = async (url, page) => {
        await page.goto(url, { waitUntil: "load" });
    };
    checkValidLogin = async () => {
        const page = await this.openPage();
        const url = `https://studio.youtube.com/channel/UC${this.channelId}`;
        await this.goto(url, page);
        const pageUrl = page.url();
        await page.close();
        if (pageUrl !== url) {
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
        await this.browserContext.close();
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
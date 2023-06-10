"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaywrightInstance = void 0;
const playwright_1 = require("playwright");
const browser_instance_1 = require("../../application/interfaces/browser.instance");
const playwright_video_upload_1 = require("./playwright.video.upload");
const common_method_1 = require("../common.method");
class PlaywrightInstance extends browser_instance_1.BrowserInstance {
    channelId;
    youtubeLocale;
    launchOptions;
    static instance;
    static getInstance = (channelId, youtubeLocale, launchOptions) => {
        if (this.instance)
            return this.instance;
        this.instance = new PlaywrightInstance(channelId, youtubeLocale, launchOptions);
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
    constructor(channelId, youtubeLocale, launchOptions) {
        super();
        this.channelId = channelId;
        this.youtubeLocale = youtubeLocale;
        this.launchOptions = launchOptions;
        this.launchOptions = {
            ignoreDefaultArgs: [
                "--disable-component-extensions-with-background-pages",
            ],
            args: ["--disable-blink-features=AutomationControlled"],
            headless: false,
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
            await this.goto(`https://studio.youtube.com/channel/UC${this.channelId}`, page);
        }
    };
    uploadVideo = async (dto) => {
        const result = playwright_video_upload_1.PlaywrightUpload.getInstance(this).uploadVideo(this.pageObj.video.page, dto);
        return result;
    };
    goto = async (url, page) => {
        await page.goto(url, { waitUntil: "load" });
    };
    checkValidLogin = async () => {
        const page = await this.openPage();
        const url = `https://studio.youtube.com/channel/UC${this.channelId}`;
        await this.goto(url, page);
        const pageUrl = page.url();
        if (pageUrl !== url) {
            throw new Error(`[ERROR] BrowserInstance: Login required`);
        }
        const monkeyEle = await page.$("#monkey");
        if (monkeyEle !== null) {
            throw new Error(`[ERROR] BrowserInstance: Cookies is not compatible. Please change cookies`);
        }
        await page.close();
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
    existFill = async ({ page, querySelector, inputStr, delayMs, maxTryCount, }) => {
        if (delayMs === undefined)
            delayMs = 500;
        if (maxTryCount === undefined)
            maxTryCount = 10;
        let tryCount = 0;
        while (true) {
            const inputEle = await page.$(querySelector);
            if (inputEle !== null) {
                await inputEle.fill(inputStr);
                break;
            }
            ++tryCount;
            if (tryCount >= maxTryCount) {
                throw new Error(`[ERROR] BrowserInstance: exist fill querySelector => ${querySelector}`);
            }
            await (0, common_method_1.delay)(delayMs);
        }
    };
    existClick = async ({ page, querySelector, delayMs, maxTryCount, throwError, }) => {
        if (delayMs === undefined)
            delayMs = 500;
        if (maxTryCount === undefined)
            maxTryCount = 10;
        if (throwError === undefined)
            throwError = true;
        let tryCount = 0;
        while (true) {
            const btnEle = await page.$(querySelector);
            if (btnEle !== null) {
                await btnEle.click();
                break;
            }
            ++tryCount;
            if (tryCount >= maxTryCount) {
                if (throwError) {
                    throw new Error(`[ERROR] BrowserInstance: exist click querySelector => ${querySelector}`);
                }
                break;
            }
            await (0, common_method_1.delay)(delayMs);
        }
    };
    fileChoose = async ({ page, querySelector, filePath, }) => {
        const fileChooserPromise = page.waitForEvent("filechooser");
        await this.existClick({ page, querySelector, maxTryCount: 5 });
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(filePath);
    };
    getYoutubeLocale = () => this.youtubeLocale;
}
exports.PlaywrightInstance = PlaywrightInstance;
//# sourceMappingURL=playwright.instance.js.map
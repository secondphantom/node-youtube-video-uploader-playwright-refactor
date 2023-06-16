"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaywrightInstance = void 0;
const playwright_1 = require("playwright");
const browser_instance_1 = require("../../application/interfaces/browser.instance");
const playwright_video_upload_1 = require("./playwright.video.upload");
const common_method_1 = require("../common.method");
class PlaywrightInstance extends browser_instance_1.BrowserInstance {
    channelId;
    userDataDir;
    youtubeLocale;
    pages;
    launchOptions;
    static instance;
    static getInstance = ({ channelId, userDataDir, youtubeLocale, pages, launchOptions, }) => {
        if (this.instance)
            return this.instance;
        this.instance = new PlaywrightInstance(channelId, userDataDir, youtubeLocale, pages && pages.length > 0 ? pages : ["video", "comment"], launchOptions);
        return this.instance;
    };
    browserContext;
    _pageObj = {
        video: {
            page: undefined,
            isBusy: false,
        },
        comment: {
            page: undefined,
            isBusy: false,
        },
    };
    get pageObj() {
        return this._pageObj;
    }
    constructor(channelId, userDataDir, youtubeLocale, pages, launchOptions) {
        super();
        this.channelId = channelId;
        this.userDataDir = userDataDir;
        this.youtubeLocale = youtubeLocale;
        this.pages = pages;
        this.launchOptions = launchOptions;
        const ignoreDefaultArgs = [
            "--disable-component-extensions-with-background-pages",
            ...(launchOptions
                ? launchOptions.ignoreDefaultArgs
                    ? launchOptions.ignoreDefaultArgs
                    : []
                : []),
        ];
        const args = [
            "--disable-blink-features=AutomationControlled",
            ...(launchOptions ? (launchOptions.args ? launchOptions.args : []) : []),
        ];
        launchOptions = {
            headless: true,
            ...launchOptions,
            ignoreDefaultArgs,
            args,
        };
        this.launchOptions = launchOptions;
    }
    goLoginPage = async () => {
        await this.openBrowser(false);
        const page = await this.openPage();
        await this.goto(`https://studio.youtube.com/channel/UC${this.channelId}`, page);
        return page;
    };
    launch = async () => {
        await this.closeBrowser();
        await this.openBrowser();
        try {
            await this.checkValidLogin();
        }
        catch (error) {
            await this.closeBrowser();
            throw new Error(error.message);
        }
        for (const pageKey in this._pageObj) {
            if (!this.pages.includes(pageKey))
                continue;
            const page = await this.browserContext.newPage();
            //@ts-ignore
            this._pageObj[pageKey].page = page;
            await this.goto(`https://studio.youtube.com/channel/UC${this.channelId}`, page);
        }
    };
    uploadVideo = async (dto) => {
        try {
            this._pageObj.video.isBusy = true;
            const result = await playwright_video_upload_1.PlaywrightUpload.getInstance(this).uploadVideo(this._pageObj.video.page, dto);
            this._pageObj.video.isBusy = false;
            return result;
        }
        catch (error) {
            this._pageObj.video.isBusy = false;
            console.error(`Upload Fail ${JSON.stringify(dto)}`);
            throw new Error(error.message);
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
        if (pageUrl !== url) {
            throw new Error(`[ERROR] BrowserInstance: Login required`);
        }
        const monkeyEle = await page.$("#monkey");
        if (monkeyEle !== null) {
            throw new Error(`[ERROR] BrowserInstance: UserData is not compatible. Please change or update UserDate`);
        }
        await page.close();
    };
    openBrowser = async (headless) => {
        if (this.browserContext)
            return;
        this.browserContext = await playwright_1.chromium.launchPersistentContext(this.userDataDir, {
            ...this.launchOptions,
            ...(headless === undefined
                ? {}
                : {
                    headless,
                }),
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        });
    };
    closeBrowser = async () => {
        if (!this.browserContext)
            return;
        await this.browserContext.close();
        this.browserContext = undefined;
    };
    openPage = async () => {
        this.browserLaunchCheck();
        const page = await this.browserContext.newPage();
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
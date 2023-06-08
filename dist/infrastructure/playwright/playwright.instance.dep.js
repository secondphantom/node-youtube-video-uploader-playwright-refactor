"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const playwright_1 = require("playwright");
class PlaywrightInstance {
    launchOptions;
    static instance;
    static getInstance = (launchOptions) => {
        if (this.instance)
            return this.instance;
        this.instance = new PlaywrightInstance(launchOptions);
        return this.instance;
    };
    browserContext;
    page;
    constructor(launchOptions) {
        this.launchOptions = launchOptions;
    }
    openBrowser = async () => {
        const browser = await playwright_1.chromium.launch(this.launchOptions);
        this.browserContext = await browser.newContext();
    };
    isBrowserLaunched = () => {
        if (!this.browserContext)
            throw new Error("Browser Not Lunched");
    };
    closeBrowser = async () => {
        this.isBrowserLaunched();
        this.browserContext.close();
        this.page = undefined;
    };
    openPage = async () => {
        this.isBrowserLaunched();
        this.page = await this.browserContext.newPage();
    };
    getCookies = async () => {
        this.isBrowserLaunched();
        const cookies = await this.browserContext.cookies("https://www.youtube.com");
        return cookies;
    };
    setCookies = async (cookies) => {
        await this.browserContext.addCookies(cookies);
    };
    isPageLaunched = () => {
        if (!this.page)
            throw new Error("Browser Not Lunched");
    };
    goto = async (url) => {
        this.isPageLaunched();
        this.page.goto(url, { waitUntil: "load" });
    };
}
//# sourceMappingURL=playwright.instance.dep.js.map
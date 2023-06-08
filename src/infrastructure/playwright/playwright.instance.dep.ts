import {
  BrowserContext,
  chromium,
  Cookie,
  ElementHandle,
  LaunchOptions,
  Page,
} from "playwright";

class PlaywrightInstance {
  static instance: PlaywrightInstance | undefined;

  static getInstance = (launchOptions: LaunchOptions) => {
    if (this.instance) return this.instance;
    this.instance = new PlaywrightInstance(launchOptions);
    return this.instance;
  };

  private browserContext: BrowserContext | undefined;
  private page: Page | undefined;
  constructor(private launchOptions: LaunchOptions) {}

  openBrowser = async () => {
    const browser = await chromium.launch(this.launchOptions);
    this.browserContext = await browser.newContext();
  };

  private isBrowserLaunched = () => {
    if (!this.browserContext) throw new Error("Browser Not Lunched");
  };

  closeBrowser = async () => {
    this.isBrowserLaunched();
    this.browserContext!.close();
    this.page = undefined;
  };

  openPage = async () => {
    this.isBrowserLaunched();
    this.page = await this.browserContext!.newPage();
  };

  getCookies = async () => {
    this.isBrowserLaunched();
    const cookies = await this.browserContext!.cookies(
      "https://www.youtube.com"
    );
    return cookies;
  };

  setCookies = async (cookies: Cookie[]) => {
    await this.browserContext!.addCookies(cookies);
  };

  private isPageLaunched = () => {
    if (!this.page) throw new Error("Browser Not Lunched");
  };

  goto = async (url: string) => {
    this.isPageLaunched();
    this.page!.goto(url, { waitUntil: "load" });
  };

  // getcookie
  // setcookie

  // open page

  // close page

  //
}

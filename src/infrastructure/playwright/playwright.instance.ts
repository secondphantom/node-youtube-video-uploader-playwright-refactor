import {
  BrowserContext,
  Cookie,
  LaunchOptions,
  Page,
  chromium,
} from "playwright";
import {
  BrowserInstance,
  GoLoginPageDto,
  LaunchDto,
  UpdateVideoDto,
  VideoIdSchema,
  WriteCommentDto,
} from "../../application/interfaces/browser.instance";

export class PlaywrightInstance extends BrowserInstance {
  static instance: PlaywrightInstance | undefined;

  static getInstance = (channelId: string, launchOptions: LaunchOptions) => {
    if (this.instance) return this.instance;
    this.instance = new PlaywrightInstance(channelId, launchOptions);
    return this.instance;
  };

  private browserContext: BrowserContext | undefined;
  private pageObj: {
    video: {
      page: Page | undefined;
      isBusy: boolean;
    };
    comment: {
      page: Page | undefined;
      isBusy: boolean;
    };
  } = {
    video: {
      page: undefined,
      isBusy: false,
    },
    comment: {
      page: undefined,
      isBusy: false,
    },
  };

  constructor(private channelId: string, private launchOptions: LaunchOptions) {
    super();
  }

  goto = async (url: string, page: Page) => {
    await page.goto(url, { waitUntil: "load" });
  };

  goLoginPage = async () => {
    await this.openBrowser();
    const page = await this.openPage();
    await this.goto(
      `https://studio.youtube.com/channel/UC${this.channelId}`,
      page
    );
    return page;
  };
  getCookie = async () => {
    this.browserLaunchCheck();
    const cookies = await this.browserContext!.cookies(
      "https://www.youtube.com"
    );
    return cookies;
  };
  launch = async (dto: LaunchDto) => {
    await this.closeBrowser();
    const { cookies } = dto;
    await this.openBrowser();
    await this.browserContext!.addCookies(cookies);
    await this.checkValidLogin();
    for (const pageKey in this.pageObj) {
      console.log(pageKey);
      //@ts-ignore
      this.pageObj[pageKey].page = await this.browserContext!.newPage();
    }
  };

  checkValidLogin = async () => {
    const page = await this.openPage();
    await this.goto(
      `https://studio.youtube.com/channel/UC${this.channelId}`,
      page
    );

    const pageUrl = page.url();
    await page.close();
    if (pageUrl.includes("https://accounts.google.com/v3/signin")) {
      throw new Error(`[ERROR] BrowserInstance: LOGIN REQUIRED`);
    }
  };

  openBrowser = async () => {
    if (this.browserContext) return;
    const browser = await chromium.launch(this.launchOptions);
    this.browserContext = await browser.newContext();
  };

  closeBrowser = async () => {
    if (!this.browserContext) return;
    this.browserContext.close();
    this.browserContext = undefined;
  };

  openPage = async () => {
    this.browserLaunchCheck();
    const page = this.browserContext!.newPage();
    return page;
  };

  private browserLaunchCheck = () => {
    if (!this.browserContext) {
      throw new Error(`[ERROR] Browser Instance: Browser Not Launched`);
    }
  };

  // uploadVideo = async (dto: UpdateVideoDto) => {};
  // deleteVideo = async (dto: VideoIdSchema) => {};
  // updateVideo = async (dto: UpdateVideoDto) => {};
  // writeComment = async (dto: WriteCommentDto) => {};
}

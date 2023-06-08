import {
  BrowserContext,
  Cookie,
  LaunchOptions,
  Page,
  chromium,
} from "playwright";
import {
  BrowserInstance,
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
      const page = await this.browserContext!.newPage();
      //@ts-ignore
      this.pageObj[pageKey].page = page;
      this.goto(`https://studio.youtube.com/channel/UC${this.channelId}`, page);
    }
  };

  private goto = async (url: string, page: Page) => {
    await page.goto(url, { waitUntil: "load" });
  };

  private checkValidLogin = async () => {
    const page = await this.openPage();
    const url = `https://studio.youtube.com/channel/UC${this.channelId}`;
    await this.goto(url, page);

    const pageUrl = page.url();
    await page.close();
    if (pageUrl !== url) {
      throw new Error(`[ERROR] BrowserInstance: LOGIN REQUIRED`);
    }
  };

  private openBrowser = async () => {
    if (this.browserContext) return;
    const browser = await chromium.launch(this.launchOptions);
    this.browserContext = await browser.newContext();
  };

  private closeBrowser = async () => {
    if (!this.browserContext) return;
    await this.browserContext.close();
    this.browserContext = undefined;
  };

  private openPage = async () => {
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

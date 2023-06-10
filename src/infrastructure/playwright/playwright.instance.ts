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
  UploadVideoDto,
} from "../../application/interfaces/browser.instance";
import { PlaywrightUpload } from "./playwright.video.upload";
import { delay } from "../common.method";

export class PlaywrightInstance extends BrowserInstance {
  static instance: PlaywrightInstance | undefined;

  static getInstance = (
    channelId: string,
    youtubeLocale: string,
    launchOptions?: LaunchOptions
  ) => {
    if (this.instance) return this.instance;
    this.instance = new PlaywrightInstance(
      channelId,
      youtubeLocale,
      launchOptions
    );

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

  constructor(
    private channelId: string,
    private youtubeLocale: string,
    private launchOptions?: LaunchOptions
  ) {
    super();
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
      await this.goto(
        `https://studio.youtube.com/channel/UC${this.channelId}`,
        page
      );
    }
  };

  uploadVideo = async (dto: UploadVideoDto) => {
    const result = PlaywrightUpload.getInstance(this).uploadVideo(
      this.pageObj.video.page!,
      dto
    );
    return result;
  };

  private goto = async (url: string, page: Page) => {
    await page.goto(url, { waitUntil: "load" });
  };

  private checkValidLogin = async () => {
    const page = await this.openPage();
    const url = `https://studio.youtube.com/channel/UC${this.channelId}`;
    await this.goto(url, page);

    const pageUrl = page.url();
    if (pageUrl !== url) {
      throw new Error(`[ERROR] BrowserInstance: Login required`);
    }
    const monkeyEle = await page.$("#monkey");
    if (monkeyEle !== null) {
      throw new Error(
        `[ERROR] BrowserInstance: Cookies is not compatible. Please change cookies`
      );
    }
    await page.close();
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

  existFill = async ({
    page,
    querySelector,
    inputStr,
    delayMs,
    maxTryCount,
  }: {
    page: Page;
    querySelector: string;
    inputStr: string;
    delayMs?: number;
    maxTryCount?: number;
  }) => {
    if (delayMs === undefined) delayMs = 500;
    if (maxTryCount === undefined) maxTryCount = 10;
    let tryCount = 0;
    while (true) {
      const inputEle = await page.$(querySelector);
      if (inputEle !== null) {
        await inputEle.fill(inputStr);
        break;
      }
      ++tryCount;
      if (tryCount >= maxTryCount) {
        throw new Error(
          `[ERROR] BrowserInstance: exist fill querySelector => ${querySelector}`
        );
      }
      await delay(delayMs);
    }
  };

  existClick = async ({
    page,
    querySelector,
    delayMs,
    maxTryCount,
    throwError,
  }: {
    page: Page;
    querySelector: string;
    delayMs?: number;
    maxTryCount?: number;
    throwError?: boolean;
  }) => {
    if (delayMs === undefined) delayMs = 500;
    if (maxTryCount === undefined) maxTryCount = 10;
    if (throwError === undefined) throwError = true;
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
          throw new Error(
            `[ERROR] BrowserInstance: exist click querySelector => ${querySelector}`
          );
        }
        break;
      }
      await delay(delayMs);
    }
  };

  fileChoose = async ({
    page,
    querySelector,
    filePath,
  }: {
    page: Page;
    querySelector: string;
    filePath: string;
  }) => {
    const fileChooserPromise = page.waitForEvent("filechooser");
    await this.existClick({ page, querySelector, maxTryCount: 5 });
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(filePath);
  };

  getYoutubeLocale = () => this.youtubeLocale;

  // uploadVideo = async (dto: UpdateVideoDto) => {};
  // deleteVideo = async (dto: VideoIdSchema) => {};
  // updateVideo = async (dto: UpdateVideoDto) => {};
  // writeComment = async (dto: WriteCommentDto) => {};
}

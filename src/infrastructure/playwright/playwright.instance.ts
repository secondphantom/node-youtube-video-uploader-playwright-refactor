import { BrowserContext, LaunchOptions, Page, chromium } from "playwright";
import {
  BrowserInstance,
  GetInstanceInput,
  ReloadPageDto,
  UploadVideoDto,
} from "../../application/interfaces/browser.instance";
import { PlaywrightUpload } from "./playwright.video.upload";
import { delay } from "../common.method";
import fs from "fs";

export class PlaywrightInstance extends BrowserInstance {
  static instance: PlaywrightInstance | undefined;

  static getInstance = (instanceInput: GetInstanceInput) => {
    if (this.instance) return this.instance;
    const { pages, launchOptions } = instanceInput;
    this.instance = new PlaywrightInstance({
      ...instanceInput,
      pages: pages && pages.length > 0 ? pages : ["video", "comment"],
      launchOptions: launchOptions ? launchOptions : {},
    });

    return this.instance;
  };

  private browserContext: BrowserContext | undefined;
  private _pageObj: {
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
  } as const;

  get pageObj() {
    return this._pageObj;
  }

  private _channelId: string;
  private authFilePath: string;
  private youtubeLocale: string;
  private pages: ("video" | "comment")[] = [];
  private launchOptions: LaunchOptions;
  constructor({
    channelId,
    authFilePath,
    youtubeLocale,
    pages,
    launchOptions,
  }: Required<GetInstanceInput>) {
    super();

    this._channelId = channelId;
    this.authFilePath = authFilePath;
    this.youtubeLocale = youtubeLocale;
    this.pages = pages;
    this.launchOptions = launchOptions;
    const ignoreDefaultArgs = [
      "--disable-component-extensions-with-background-pages",
      ...(launchOptions
        ? launchOptions.ignoreDefaultArgs
          ? (launchOptions.ignoreDefaultArgs as any)
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

  get channelId() {
    return this._channelId;
  }

  goLoginPage = async () => {
    await this.openBrowser({ headless: false, setAuth: false });
    const page = await this.openPage();
    await this.goto(
      `https://studio.youtube.com/channel/${this.channelId}`,
      page
    );
    return page;
  };

  launch = async () => {
    await this.closeBrowser();

    try {
      await this.openBrowser();
      await this.checkValidLogin();
    } catch (error: any) {
      await this.closeBrowser();
      throw new Error(error.message);
    }

    for (const pageKey in this._pageObj) {
      if (!this.pages.includes(pageKey as any)) continue;
      const page = await this.browserContext!.newPage();
      //@ts-ignore
      this._pageObj[pageKey].page = page;
      await this.goto(
        `https://studio.youtube.com/channel/${this.channelId}`,
        page
      );
    }
  };

  uploadVideo = async (dto: UploadVideoDto) => {
    try {
      this._pageObj.video.isBusy = true;
      const result = await PlaywrightUpload.getInstance(this).uploadVideo(
        this._pageObj.video.page!,
        dto
      );
      this._pageObj.video.isBusy = false;
      return result;
    } catch (error: any) {
      this._pageObj.video.isBusy = false;
      console.error(`Upload Fail ${JSON.stringify(dto)}`);
      throw new Error(error.message);
    }
  };

  private goto = async (url: string, page: Page) => {
    await page.goto(url, { waitUntil: "load" });
  };

  checkValidLogin = async () => {
    const page = await this.openPage();
    const url = `https://studio.youtube.com/channel/${this.channelId}`;
    await this.goto(url, page);

    const pageUrl = page.url();
    if (pageUrl !== url) {
      throw new Error(
        `[ERROR] BrowserInstance: Login required ChannelId: ${this.channelId}`
      );
    }
    const monkeyEle = await page.$("#monkey");
    if (monkeyEle !== null) {
      throw new Error(
        `[ERROR] BrowserInstance: UserData is not compatible. Please change or update UserDate`
      );
    }
    await page.close();
  };

  private openBrowser = async (initConfig?: {
    headless?: boolean;
    setAuth?: boolean;
  }) => {
    const { headless, setAuth } = initConfig
      ? initConfig
      : { headless: true, setAuth: true };
    if (this.browserContext) return;

    const browser = await chromium.launch({
      headless,
      ...this.launchOptions,
    });
    if (setAuth) {
      const auth = await this.getAuth();
      this.browserContext = await browser.newContext({
        storageState: auth,
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
      });
    } else {
      this.browserContext = await browser.newContext({
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
      });
    }
  };

  private closeBrowser = async () => {
    if (!this.browserContext) return;
    await this.browserContext.close();
    this.browserContext = undefined;
  };

  private openPage = async () => {
    this.browserLaunchCheck();
    const page = await this.browserContext!.newPage();
    return page;
  };

  reloadPage = async (dto: ReloadPageDto) => {
    const { page } = dto;
    if (!this._pageObj[page].page) {
      console.log(`[INFO] Browser Instance: ${page} not launched`);
      return;
    }
    await this._pageObj[page].page!.reload({ waitUntil: "networkidle" });
  };

  private browserLaunchCheck = () => {
    if (!this.browserContext) {
      throw new Error(`[ERROR] Browser Instance: Browser Not Launched`);
    }
  };

  private getAuth = async () => {
    try {
      const auth = await fs.promises
        .readFile(this.authFilePath, { encoding: "utf-8" })
        .then(JSON.parse);
      return auth as ReturnType<BrowserContext["storageState"]>;
    } catch (error) {
      throw new Error(`[ERROR] Cannot Get AuthFile`);
    }
  };

  saveAuthFile = async () => {
    this.browserLaunchCheck();
    const auth = await this.browserContext!.storageState();
    await fs.promises.writeFile(this.authFilePath, JSON.stringify(auth));
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

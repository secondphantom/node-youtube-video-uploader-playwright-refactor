import { PlaywrightInstance } from "../../../infrastructure/playwright/playwright.instance";
import { Page } from "playwright";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
import { UploadVideoDto } from "../../../application/interfaces/browser.instance";
import { delay } from "../../../infrastructure/common.method";

describe("Playwright Browser Instance", () => {
  let browserInstance: PlaywrightInstance;
  beforeAll(async () => {
    browserInstance = PlaywrightInstance.getInstance({
      channelId: process.env.CHANNEL_ID!,
      youtubeLocale: process.env.YOUTUBE_LOCALE!,
      pages: ["video", "comment"],
      launchOptions: {
        headless: false,
      },
    });
    await browserInstance["openBrowser"]();
  });

  afterAll(async () => {
    browserInstance["closeBrowser"]();
  }, 120000);

  describe.skip("Login", () => {
    test("go to url", async () => {
      const url = "https://www.youtube.com";
      const page = await browserInstance["openPage"]();

      await browserInstance["goto"](url, page);

      const pageUrl = page.url();

      expect(pageUrl).toMatch("https://www.youtube.com");
    });
    test("get cookies", async () => {
      const cookies = await browserInstance.getCookie();

      const cookieSchema = expect.objectContaining({
        name: expect.any(String),
        value: expect.any(String),
        domain: expect.stringMatching(".youtube.com"),
        path: expect.any(String),
        expires: expect.any(Number),
        httpOnly: expect.any(Boolean),
        secure: expect.any(Boolean),
        sameSite: expect.any(String),
      });
      expect(cookies[0]).toEqual(cookieSchema);
    });
    test("Go Login Page", async () => {
      const page = await browserInstance.goLoginPage();

      const pageUrl = page.url();

      expect(pageUrl).toContain("https://accounts.google.com/v3/signin");
    });
    test("Check Valid Login", async () => {
      let error;
      try {
        await browserInstance["checkValidLogin"]();
      } catch (e) {
        error = e;
      }
      expect(error).toEqual(expect.anything());
    });
    test.only("Launch", async () => {
      const cookies = await fs.promises
        .readFile("./exclude/test-cookies.json", {
          encoding: "utf-8",
        })
        .then(JSON.parse);

      await browserInstance.launch({ cookies });
      await delay(120000);
    }, 120000);
  });

  describe.only("Video", () => {
    test.only("Upload Video", async () => {
      const cookies = (await fs.promises
        .readFile(process.env.COOKIES_FILE_PATH!, {
          encoding: "utf-8",
        })
        .then(JSON.parse)) as any;
      await browserInstance.launch({
        cookies,
      });

      const dto: UploadVideoDto = {
        meta: {
          title: "테스트",
          description: "테스트 설명",
          // playlist: ["테스티", "추가"],
          tags: ["테그1", "테그2"],
        },
        filePath: {
          video: "./video.mp4",
          thumbnail: "./thumbnail.jpg",
        },
        config: {
          visibility: "schedule",
          notifySubscribers: false,
          schedule: new Date(new Date().setHours(new Date().getHours() + 1)),
        },
      };

      const { videoId } = await browserInstance.uploadVideo(dto);

      expect(videoId).toEqual(expect.any(String));
      // console.log(videoId);
      // await delay(10000);
    }, 120000);
  });
});

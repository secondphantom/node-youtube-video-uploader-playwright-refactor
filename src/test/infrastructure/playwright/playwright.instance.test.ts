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
      userDataDir: process.env.USER_DATA_DIR_PATH!,
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

  describe.only("Login", () => {
    test("go to url", async () => {
      const url = "https://www.youtube.com";
      const page = await browserInstance["openPage"]();

      await browserInstance["goto"](url, page);

      const pageUrl = page.url();

      expect(pageUrl).toMatch("https://www.youtube.com");
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
  });

  describe.skip("Video", () => {
    test.only("Upload Video", async () => {
      await browserInstance.launch();

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

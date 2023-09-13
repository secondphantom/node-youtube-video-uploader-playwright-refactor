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
      authFilePath: process.env.AUTH_FILE_PATH!,
      pages: ["video"],
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
    test.skip("go to url", async () => {
      const url = "https://www.youtube.com";
      const page = await browserInstance["openPage"]();

      await browserInstance["goto"](url, page);

      const pageUrl = page.url();

      expect(pageUrl).toMatch("https://www.youtube.com");
    });

    test.skip("Go Login Page", async () => {
      const page = await browserInstance.goLoginPage();

      const pageUrl = page.url();

      expect(pageUrl).toContain("https://accounts.google.com/v3/signin");
      await delay(10000);
    });

    test.skip("Check Valid Login", async () => {
      let error;
      try {
        await browserInstance["checkValidLogin"]();
      } catch (e) {
        error = e;
      }
      expect(error).toEqual(expect.anything());
    });

    test.only("Get Channel Id", async () => {
      const channelId = browserInstance.channelId;
      expect(channelId).toEqual(process.env.CHANNEL_ID!);
    });
  });

  describe.skip("page", () => {
    test("reload", async () => {
      const url = "https://maki-chan.de/preventclose.htm";
      const page = await browserInstance["openPage"]();
      browserInstance.pageObj.video.page = page;
      await browserInstance["goto"](url, page);
      await browserInstance["existClick"]({
        page,
        querySelector: "a",
      });
      await delay(2000);
      await browserInstance.reloadPage({ page: "video" });
      const pageUrl = page.url();
      expect(pageUrl).toContain("https://maki-chan.de/preventclose.htm");
    });
  });

  describe.skip("Video", () => {
    test.only("Upload Video", async () => {
      await browserInstance.launch();

      const dto: UploadVideoDto = {
        meta: {
          title: "테스트",
          description: "테스트 설명",
          playlist: [
            "2023 K-Pop for Random Dance",
            "2023 K-Pop",
            "2023 K-Pop Girl",
            "NewJeans",
          ],
          tags: ["테그1", "테그2"],
        },
        filePath: {
          video: "./video.mp4",
          thumbnail: "./thumbnail.jpg",
        },
        config: {
          visibility: "private",
          notifySubscribers: false,
          // schedule: new Date(new Date().setHours(new Date().getHours() + 1)),
        },
      };

      const { videoId } = await browserInstance.uploadVideo(dto);

      expect(videoId).toEqual(expect.any(String));
      // console.log(videoId);
      await delay(10000);
    }, 120000);
  });
});

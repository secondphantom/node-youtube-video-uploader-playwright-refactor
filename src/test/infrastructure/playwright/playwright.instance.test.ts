import { PlaywrightInstance } from "../../../infrastructure/playwright/playwright.instance";
import { Page } from "playwright";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

describe("Playwright Browser Instance", () => {
  let browserInstance: PlaywrightInstance;
  beforeAll(async () => {
    browserInstance = PlaywrightInstance.getInstance(process.env.CHANNEL_ID!, {
      headless: false,
    });
    await browserInstance["openBrowser"]();
  });

  afterAll(async () => {
    browserInstance["closeBrowser"]();
  }, 120000);

  describe("Login", () => {
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
        .readFile("./exclude/kr-cookies.json", {
          encoding: "utf-8",
        })
        .then(JSON.parse);

      await browserInstance.launch({ cookies });
    });
  });

  describe("Video", () => {});
});

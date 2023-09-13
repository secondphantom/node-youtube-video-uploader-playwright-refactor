import { PlaywrightInstance } from "../../../infrastructure/playwright/playwright.instance";
import { LoginService } from "../../../application/service/login.service";
import dotenv from "dotenv";
import { delay } from "../../../infrastructure/common.method";
dotenv.config();

describe.only("Service Login", () => {
  let browserInstance: PlaywrightInstance;
  let loginService: LoginService;
  beforeAll(async () => {
    browserInstance = PlaywrightInstance.getInstance({
      channelId: process.env.CHANNEL_ID!,
      youtubeLocale: process.env.YOUTUBE_LOCALE!,
      authFilePath: process.env.AUTH_FILE_PATH!,
      pages: ["video", "comment"],
      launchOptions: {
        headless: false,
      },
    });
    loginService = LoginService.getInstance(browserInstance);
  });

  afterAll(async () => {
    browserInstance["closeBrowser"]();
  }, 120000);

  describe.only("Login", () => {
    test("Success", async () => {
      const { isLogin } = await loginService.login();
      expect(isLogin).toEqual(true);
      await delay(10000);
    }, 120000);
  });
});

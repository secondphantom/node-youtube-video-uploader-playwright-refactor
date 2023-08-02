import { PlaywrightInstance } from "../../../infrastructure/playwright/playwright.instance";
import { LoginService } from "../../../application/service/login.service";
import dotenv from "dotenv";
dotenv.config();
describe.only("Service Login", () => {
  let browserInstance: PlaywrightInstance;
  let loginService: LoginService;
  beforeAll(async () => {
    browserInstance = PlaywrightInstance.getInstance({
      channelId: process.env.CHANNEL_ID!,
      youtubeLocale: process.env.YOUTUBE_LOCALE!,
      cookieFilePath: process.env.COOKIE_FILE_PATH!,
      pages: ["video", "comment"],
      launchOptions: {
        headless: true,
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
    }, 120000);
  });
});

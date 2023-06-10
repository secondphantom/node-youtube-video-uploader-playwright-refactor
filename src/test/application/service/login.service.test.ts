import { PlaywrightInstance } from "../../../infrastructure/playwright/playwright.instance";
import { LoginService } from "../../../application/service/login.service";
import dotenv from "dotenv";
dotenv.config();
describe.only("Service Login", () => {
  let browserInstance: PlaywrightInstance;
  let loginService: LoginService;
  beforeAll(async () => {
    browserInstance = PlaywrightInstance.getInstance(
      process.env.CHANNEL_ID!,
      process.env.YOUTUBE_LOCALE!,
      {
        headless: false,
      }
    );
    loginService = LoginService.getInstance(
      browserInstance,
      process.env.COOKIES_FILE_PATH!
    );
  });

  afterAll(async () => {}, 120000);

  describe.skip("Get File Cookies", () => {
    test.only("Success", () => {
      const cookiesFilePath = "./exclude/test-cookies.json";

      const cookies = loginService["getFileCookies"](cookiesFilePath);

      expect(cookies).toEqual(expect.any(Array));
    });
    test("Fail", () => {
      const cookiesFilePath = "./exclude/invalid-cookies.json";

      const cookies = loginService["getFileCookies"](cookiesFilePath);
      expect(cookies).toEqual(null);
    });
  });

  test.skip("Get Browser Cookies", async () => {
    const cookiesFilePath = "./exclude/test-cookies.json";

    const cookies = await loginService["getBrowserCookies"](cookiesFilePath);

    expect(cookies).toEqual(expect.anything());
  }, 120000);

  describe.only("Login", () => {
    test("Success", async () => {
      const res = await loginService.login();
      expect(res).toEqual(true);
    }, 120000);
  });
});

import { Cookie } from "playwright";
import { BrowserInstance, LaunchDto } from "../interfaces/browser.instance";
import fs from "fs";
import { stdin as input, stdout as output } from "process";
import * as readline from "readline/promises";
import { ResponseDto } from "../dto/response.dto";

// export type LoginServiceDto = {
//   cookiesFilePath: string;
// };

export class LoginService {
  static instance: LoginService | undefined;

  static getInstance = (
    browserInstance: BrowserInstance,
    cookiesFilePath: string
  ) => {
    if (this.instance) return this.instance;
    this.instance = new LoginService(browserInstance, cookiesFilePath);
    return this.instance;
  };

  private rl = readline.createInterface({ input, output });
  constructor(
    private browserInstance: BrowserInstance,
    private cookiesFilePath: string
  ) {}

  login = async () => {
    let cookies = this.getFileCookies(this.cookiesFilePath);
    if (cookies === null) {
      cookies = await this.getBrowserCookies(this.cookiesFilePath);
    }
    await this.browserInstance.launch({ cookies });
    return { isLogin: true };
  };

  private getFileCookies = (cookiesFilePath: string) => {
    try {
      const cookies = JSON.parse(
        fs.readFileSync(cookiesFilePath, { encoding: "utf-8" })
      ) as Cookie[];
      return cookies;
    } catch (error) {
      console.info("[ERROR]LOGIN SERVICE: get cookies by file");
      return null;
    }
  };

  private getBrowserCookies = async (cookiesFilePath: string) => {
    await this.browserInstance.goLoginPage();
    await this.rl.question("Login youtube channel. Did you login? (Enter)\n");
    const cookies = await this.browserInstance.getCookie();
    fs.writeFileSync(cookiesFilePath, JSON.stringify(cookies));
    return cookies;
  };
}

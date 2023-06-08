import { Cookie } from "playwright";
import { BrowserInstance, LaunchDto } from "../interfaces/browser.instance";
import fs from "fs";
import { stdin as input, stdout as output } from "process";
import * as readline from "readline/promises";
import { ResponseDto } from "../dto/response.dto";

export type LoginServiceDto = {
  cookiesFilePath: string;
  channelId: string;
};

export class LoginService {
  static instance: LoginService | undefined;

  static getInstance = (browserInstance: BrowserInstance) => {
    if (this.instance) return this.instance;
    this.instance = new LoginService(browserInstance);
    return this.instance;
  };
  private rl = readline.createInterface({ input, output });
  constructor(private browserInstance: BrowserInstance) {}

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

  private getBrowserCookies = async (
    cookiesFilePath: string,
    channelId: string
  ) => {
    await this.browserInstance.goLoginPage({ channelId });
    await this.rl.question("Login youtube channel. Did you login?\n");
    const cookies = await this.browserInstance.getCookie();
    fs.writeFileSync(cookiesFilePath, JSON.stringify(cookies));
    return cookies;
  };

  login = async (dto: LoginServiceDto) => {
    try {
      let cookies = this.getFileCookies(dto.cookiesFilePath);
      if (cookies === null) {
        cookies = await this.getBrowserCookies(
          dto.cookiesFilePath,
          dto.channelId
        );
      }
      await this.browserInstance.launch({ cookies });
      return new ResponseDto({
        payload: {
          success: true,
          data: {
            message: "LOGIN SUCCESS",
          },
        },
      });
    } catch (error: any) {
      return new ResponseDto({
        payload: {
          success: false,
          data: {
            message: error.message,
          },
        },
      });
    }
  };
}

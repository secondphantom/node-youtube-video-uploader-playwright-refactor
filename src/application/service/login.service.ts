import { BrowserInstance } from "../interfaces/browser.instance";
import { stdin as input, stdout as output } from "process";
import * as readline from "readline/promises";

export class LoginService {
  static instance: LoginService | undefined;

  static getInstance = (browserInstance: BrowserInstance) => {
    if (this.instance) return this.instance;
    this.instance = new LoginService(browserInstance);
    return this.instance;
  };

  private rl = readline.createInterface({ input, output });

  constructor(private browserInstance: BrowserInstance) {}

  login = async () => {
    try {
      await this.browserInstance.launch();
    } catch (error: any) {
      console.log(error.message);
      await this.updateAuth();
      await this.browserInstance.launch();
    }
    return { isLogin: true };
  };

  private updateAuth = async () => {
    await this.browserInstance.goLoginPage();
    const channelId = this.browserInstance.channelId;
    await this.rl.question(
      `Login youtube channelId: ${channelId}. Did you login? (Enter)\n`
    );
    await this.browserInstance.saveCookie();
  };
}

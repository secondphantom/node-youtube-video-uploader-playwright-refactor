import { BrowserInstance } from "../interfaces/browser.instance";
export declare class LoginService {
    private browserInstance;
    private cookiesFilePath;
    static instance: LoginService | undefined;
    static getInstance: (browserInstance: BrowserInstance, cookiesFilePath: string) => LoginService;
    private rl;
    constructor(browserInstance: BrowserInstance, cookiesFilePath: string);
    login: () => Promise<boolean>;
    private getFileCookies;
    private getBrowserCookies;
}

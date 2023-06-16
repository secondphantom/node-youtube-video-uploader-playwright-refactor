import { BrowserInstance } from "../interfaces/browser.instance";
export declare class LoginService {
    private browserInstance;
    static instance: LoginService | undefined;
    static getInstance: (browserInstance: BrowserInstance) => LoginService;
    private rl;
    constructor(browserInstance: BrowserInstance);
    login: () => Promise<{
        isLogin: boolean;
    }>;
    private updateUserDate;
}

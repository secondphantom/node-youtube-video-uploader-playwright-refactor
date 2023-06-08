import { BrowserInstance } from "../interfaces/browser.instance";
import { ResponseDto } from "../dto/response.dto";
export type LoginServiceDto = {
    cookiesFilePath: string;
};
export declare class LoginService {
    private browserInstance;
    static instance: LoginService | undefined;
    static getInstance: (browserInstance: BrowserInstance) => LoginService;
    private rl;
    constructor(browserInstance: BrowserInstance);
    private getFileCookies;
    private getBrowserCookies;
    login: (dto: LoginServiceDto) => Promise<ResponseDto<{
        message: any;
    }>>;
}

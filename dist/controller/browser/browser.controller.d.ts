import { ResponseDto } from "../../application/dto/response.dto";
import { ReloadPageDto } from "../../application/interfaces/browser.instance";
import { BrowserService } from "../../application/service/browser.service";
import { BrowserControllerInterface } from "./browser.interface";
export declare class BrowserController implements BrowserControllerInterface {
    private browserService;
    static instance: BrowserController | undefined;
    static getInstance: (browserService: BrowserService) => BrowserController;
    constructor(browserService: BrowserService);
    reloadPage: (dto: ReloadPageDto) => Promise<ResponseDto<void> | ResponseDto<{
        message: any;
    }>>;
}

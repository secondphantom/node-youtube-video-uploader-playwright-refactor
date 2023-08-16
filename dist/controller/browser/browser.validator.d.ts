import { ResponseDto } from "../../application/dto/response.dto";
import { ReloadPageDto } from "../../application/interfaces/browser.instance";
import { BrowserControllerInterface, BrowserValidatorInterface } from "./browser.interface";
export declare class BrowserValidatorController implements BrowserControllerInterface {
    private browserValidator;
    private browserController;
    static instance: BrowserValidatorController | undefined;
    constructor(browserValidator: BrowserValidatorInterface, browserController: BrowserControllerInterface);
    static getInstance: (browserValidator: BrowserValidatorInterface, browserController: BrowserControllerInterface) => BrowserValidatorController;
    reloadPage: (dto: ReloadPageDto) => Promise<ResponseDto<any>>;
}

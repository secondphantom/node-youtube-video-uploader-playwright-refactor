import { ReloadPageDto } from "../../application/interfaces/browser.instance";
import { BrowserValidatorInterface } from "../../controller/browser/browser.interface";
export declare class BrowserValidator implements BrowserValidatorInterface {
    static instance: BrowserValidator | undefined;
    static getInstance: () => BrowserValidator;
    private reloadPageDto;
    reloadPage: (dto: ReloadPageDto) => {
        page: "video" | "comment";
    };
}

import { BrowserInstance, ReloadPageDto } from "../interfaces/browser.instance";
export declare class BrowserService {
    private browserInstance;
    static instance: BrowserService | undefined;
    static getInstance: (browserInstance: BrowserInstance) => BrowserService;
    constructor(browserInstance: BrowserInstance);
    reloadPage: (dto: ReloadPageDto) => Promise<void>;
}

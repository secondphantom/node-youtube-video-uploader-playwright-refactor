"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserService = void 0;
class BrowserService {
    browserInstance;
    static instance;
    static getInstance = (browserInstance) => {
        if (this.instance)
            return this.instance;
        this.instance = new BrowserService(browserInstance);
        return this.instance;
    };
    constructor(browserInstance) {
        this.browserInstance = browserInstance;
    }
    reloadPage = async (dto) => {
        await this.browserInstance.reloadPage(dto);
    };
}
exports.BrowserService = BrowserService;
//# sourceMappingURL=browser.service.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserController = void 0;
const response_dto_1 = require("../../application/dto/response.dto");
class BrowserController {
    browserService;
    static instance;
    static getInstance = (browserService) => {
        if (this.instance)
            return this.instance;
        this.instance = new BrowserController(browserService);
        return this.instance;
    };
    constructor(browserService) {
        this.browserService = browserService;
    }
    reloadPage = async (dto) => {
        try {
            const result = await this.browserService.reloadPage(dto);
            return new response_dto_1.ResponseDto({
                payload: {
                    success: true,
                    data: result,
                },
            });
        }
        catch (error) {
            return new response_dto_1.ResponseDto({
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
exports.BrowserController = BrowserController;
//# sourceMappingURL=browser.controller.js.map
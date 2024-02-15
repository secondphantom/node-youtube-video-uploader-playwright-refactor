"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserValidatorController = void 0;
const response_dto_1 = require("../../application/dto/response.dto");
class BrowserValidatorController {
    browserValidator;
    browserController;
    static instance;
    constructor(browserValidator, browserController) {
        this.browserValidator = browserValidator;
        this.browserController = browserController;
    }
    static getInstance = (browserValidator, browserController) => {
        if (this.instance)
            return this.instance;
        this.instance = new BrowserValidatorController(browserValidator, browserController);
        return this.instance;
    };
    reloadPage = async (dto) => {
        try {
            const validDto = this.browserValidator.reloadPage(dto);
            const result = await this.browserController.reloadPage(validDto);
            return result;
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
exports.BrowserValidatorController = BrowserValidatorController;

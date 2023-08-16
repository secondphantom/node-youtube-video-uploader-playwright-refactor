"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserValidator = void 0;
const zod_1 = __importDefault(require("zod"));
const zod_validation_error_1 = require("zod-validation-error");
class BrowserValidator {
    static instance;
    static getInstance = () => {
        if (this.instance)
            return this.instance;
        this.instance = new BrowserValidator();
        return this.instance;
    };
    reloadPageDto = zod_1.default.object({
        page: zod_1.default.union([zod_1.default.literal("video"), zod_1.default.literal("comment")]),
    });
    reloadPage = (dto) => {
        try {
            const result = this.reloadPageDto.parse(dto);
            return result;
        }
        catch (error) {
            const validationError = (0, zod_validation_error_1.fromZodError)(error);
            throw new Error(validationError.message);
        }
    };
}
exports.BrowserValidator = BrowserValidator;
//# sourceMappingURL=browser.validator.js.map
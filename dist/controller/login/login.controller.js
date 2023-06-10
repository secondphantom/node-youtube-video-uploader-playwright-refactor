"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginController = void 0;
const response_dto_1 = require("../../application/dto/response.dto");
class LoginController {
    loginService;
    static instance;
    static getInstance = (loginService) => {
        if (this.instance)
            return this.instance;
        this.instance = new LoginController(loginService);
        return this.instance;
    };
    constructor(loginService) {
        this.loginService = loginService;
    }
    login = async () => {
        try {
            const result = await this.loginService.login();
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
exports.LoginController = LoginController;
//# sourceMappingURL=login.controller.js.map
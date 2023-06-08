"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginService = void 0;
const fs_1 = __importDefault(require("fs"));
const process_1 = require("process");
const readline = __importStar(require("readline/promises"));
const response_dto_1 = require("../dto/response.dto");
class LoginService {
    browserInstance;
    static instance;
    static getInstance = (browserInstance) => {
        if (this.instance)
            return this.instance;
        this.instance = new LoginService(browserInstance);
        return this.instance;
    };
    rl = readline.createInterface({ input: process_1.stdin, output: process_1.stdout });
    constructor(browserInstance) {
        this.browserInstance = browserInstance;
    }
    getFileCookies = (cookiesFilePath) => {
        try {
            const cookies = JSON.parse(fs_1.default.readFileSync(cookiesFilePath, { encoding: "utf-8" }));
            return cookies;
        }
        catch (error) {
            console.info("[ERROR]LOGIN SERVICE: get cookies by file");
            return null;
        }
    };
    getBrowserCookies = async (cookiesFilePath, channelId) => {
        await this.browserInstance.goLoginPage({ channelId });
        await this.rl.question("Login youtube channel. Did you login?\n");
        const cookies = await this.browserInstance.getCookie();
        fs_1.default.writeFileSync(cookiesFilePath, JSON.stringify(cookies));
        return cookies;
    };
    login = async (dto) => {
        try {
            let cookies = this.getFileCookies(dto.cookiesFilePath);
            if (cookies === null) {
                cookies = await this.getBrowserCookies(dto.cookiesFilePath, dto.channelId);
            }
            await this.browserInstance.launch({ cookies });
            return new response_dto_1.ResponseDto({
                payload: {
                    success: true,
                    data: {
                        message: "LOGIN SUCCESS",
                    },
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
exports.LoginService = LoginService;
//# sourceMappingURL=login.service.js.map
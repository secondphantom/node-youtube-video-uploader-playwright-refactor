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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginService = void 0;
const process_1 = require("process");
const readline = __importStar(require("readline/promises"));
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
    login = async () => {
        try {
            await this.browserInstance.launch();
        }
        catch (error) {
            console.log(error.message);
            await this.updateUserDate();
            await this.browserInstance.launch();
        }
        return { isLogin: true };
    };
    updateUserDate = async () => {
        await this.browserInstance.goLoginPage();
        await this.rl.question("Login youtube channel. Did you login? (Enter)\n");
    };
}
exports.LoginService = LoginService;
//# sourceMappingURL=login.service.js.map
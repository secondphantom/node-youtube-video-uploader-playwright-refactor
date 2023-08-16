"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YoutubeUtil = void 0;
const login_service_1 = require("../../application/service/login.service");
const video_service_1 = require("../../application/service/video.service");
const login_controller_1 = require("../../controller/login/login.controller");
const playwright_instance_1 = require("../playwright/playwright.instance");
const video_validator_1 = require("../../controller/video/video.validator");
const video_validator_2 = require("../validator/video.validator");
const video_controller_1 = require("../../controller/video/video.controller");
const browser_controller_1 = require("../../controller/browser/browser.controller");
const browser_service_1 = require("../../application/service/browser.service");
class YoutubeUtil {
    loginController;
    videoController;
    browserController;
    browserInstance;
    constructor(config) {
        const { launchOptions, pages } = config;
        this.browserInstance = new playwright_instance_1.PlaywrightInstance({
            ...config,
            pages: pages && pages.length > 0 ? pages : ["video", "comment"],
            launchOptions: launchOptions ? launchOptions : {},
        });
        this.loginController = new login_controller_1.LoginController(new login_service_1.LoginService(this.browserInstance));
        this.videoController = new video_validator_1.VideoValidatorController(new video_validator_2.VideoValidator(), new video_controller_1.VideoController(new video_service_1.VideoService(this.browserInstance)));
        this.browserController = new browser_controller_1.BrowserController(new browser_service_1.BrowserService(this.browserInstance));
    }
    login = async () => {
        const result = await this.loginController.login();
        return this.responseResolver(result);
    };
    reloadPage = async (dto) => {
        const result = await this.browserController.reloadPage(dto);
        return this.responseResolver(result);
    };
    uploadVideo = async (dto) => {
        const result = await this.videoController.uploadVideo(dto);
        return this.responseResolver(result);
    };
    get pageObj() {
        return this.browserInstance.pageObj;
    }
    responseResolver = (responseDto) => {
        const { payload: { data, success }, } = responseDto;
        if (success) {
            return data;
        }
        throw new Error(data.message);
    };
}
exports.YoutubeUtil = YoutubeUtil;
//# sourceMappingURL=module.js.map
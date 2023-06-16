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
class YoutubeUtil {
    LoginController;
    VideoController;
    browserInstance;
    constructor(config) {
        const { channelId, userDataDir, youtubeLocale, launchOptions, pages } = config;
        this.browserInstance = playwright_instance_1.PlaywrightInstance.getInstance({
            channelId,
            userDataDir,
            youtubeLocale,
            pages,
            launchOptions,
        });
        this.LoginController = login_controller_1.LoginController.getInstance(login_service_1.LoginService.getInstance(this.browserInstance));
        this.VideoController = video_validator_1.VideoValidatorController.getInstance(video_validator_2.VideoValidator.getInstance(), video_controller_1.VideoController.getInstance(video_service_1.VideoService.getInstance(this.browserInstance)));
    }
    login = async () => {
        const result = await this.LoginController.login();
        return this.responseResolver(result);
    };
    uploadVideo = async (dto) => {
        const result = await this.VideoController.uploadVideo(dto);
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
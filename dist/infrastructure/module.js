"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const login_service_1 = require("../application/service/login.service");
const video_service_1 = require("../application/service/video.service");
const login_controller_1 = require("../controller/login/login.controller");
const playwright_instance_1 = require("./playwright/playwright.instance");
const video_validator_1 = require("../controller/video/video.validator");
const video_validator_2 = require("./validator/video.validator");
const video_controller_1 = require("../controller/video/video.controller");
class YoutubeUploader {
    LoginController;
    VideoController;
    constructor(config) {
        const { cookiesFilePath, channelId, youtubeLocale, launchOptions } = config;
        const browserInstance = playwright_instance_1.PlaywrightInstance.getInstance(channelId, youtubeLocale, launchOptions);
        this.LoginController = login_controller_1.LoginController.getInstance(login_service_1.LoginService.getInstance(browserInstance, cookiesFilePath));
        this.VideoController = video_validator_1.VideoValidatorController.getInstance(video_validator_2.VideoValidator.getInstance(), video_controller_1.VideoController.getInstance(video_service_1.VideoService.getInstance(browserInstance)));
    }
    login = async () => { };
    responseResolver = (responseDto) => {
        const { payload: { data, success }, } = responseDto;
        if (success) {
            return data;
        }
        throw new Error(data.message);
    };
}
//# sourceMappingURL=module.js.map
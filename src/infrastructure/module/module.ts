import { LaunchOptions } from "playwright";
import { LoginService } from "../../application/service/login.service";
import { VideoService } from "../../application/service/video.service";
import { LoginController } from "../../controller/login/login.controller";
import { LoginControllerInterface } from "../../controller/login/login.interface";
import { VideoValidatorControllerInterface } from "../../controller/video/video.interface";
import { PlaywrightInstance } from "../playwright/playwright.instance";
import { VideoValidatorController } from "../../controller/video/video.validator";
import { VideoValidator } from "../validator/video.validator";
import { VideoController } from "../../controller/video/video.controller";
import { ResponseDto } from "../../application/dto/response.dto";
import {
  UpdateVideoDto,
  UploadVideoDto,
  VideoIdSchema,
} from "../../application/interfaces/browser.instance";

export interface YoutubeUtilConfig {
  cookiesFilePath: string;
  channelId: string;
  youtubeLocale: string;
  launchOptions?: LaunchOptions;
}

export class YoutubeUtil {
  private LoginController;
  private VideoController;

  constructor(config: YoutubeUtilConfig) {
    const { cookiesFilePath, channelId, youtubeLocale, launchOptions } = config;
    const browserInstance = PlaywrightInstance.getInstance(
      channelId,
      youtubeLocale,
      launchOptions
    );
    this.LoginController = LoginController.getInstance(
      LoginService.getInstance(browserInstance, cookiesFilePath)
    );
    this.VideoController = VideoValidatorController.getInstance(
      VideoValidator.getInstance(),
      VideoController.getInstance(VideoService.getInstance(browserInstance))
    );
  }

  login = async () => {
    const result = await this.LoginController.login();
    return this.responseResolver<{ isLogin: boolean }>(result);
  };

  uploadVideo = async (dto: UploadVideoDto) => {
    const result = await this.VideoController.uploadVideo(dto);
    return this.responseResolver<VideoIdSchema>(result);
  };

  private responseResolver = <T>(responseDto: ResponseDto) => {
    const {
      payload: { data, success },
    } = responseDto;
    if (success) {
      return data as T;
    }
    throw new Error(data.message);
  };
}

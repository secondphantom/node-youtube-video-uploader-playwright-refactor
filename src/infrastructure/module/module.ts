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
  GetInstanceInput,
  UpdateVideoDto,
  UploadVideoDto,
  VideoIdSchema,
} from "../../application/interfaces/browser.instance";

export type YoutubeUtilConfig = GetInstanceInput;
export class YoutubeUtil {
  private LoginController;
  private VideoController;
  private browserInstance: PlaywrightInstance;

  constructor(config: YoutubeUtilConfig) {
    const { launchOptions, pages } = config;
    this.browserInstance = new PlaywrightInstance({
      ...config,
      pages: pages && pages.length > 0 ? pages : ["video", "comment"],
      launchOptions: launchOptions ? launchOptions : {},
    });
    this.LoginController = new LoginController(
      new LoginService(this.browserInstance)
    );
    this.VideoController = new VideoValidatorController(
      new VideoValidator(),
      new VideoController(new VideoService(this.browserInstance))
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

  get pageObj() {
    return this.browserInstance.pageObj;
  }

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

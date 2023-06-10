import { ResponseDto } from "../dto/response.dto";
import {
  BrowserInstance,
  UploadVideoDto,
} from "../interfaces/browser.instance";

export class VideoService {
  static instance: VideoService | undefined;

  static getInstance = (browserInstance: BrowserInstance) => {
    if (this.instance) return this.instance;
    this.instance = new VideoService(browserInstance);
    return this.instance;
  };

  constructor(private browserInstance: BrowserInstance) {}

  uploadVideo = async (dto: UploadVideoDto) => {
    try {
      const result = await this.browserInstance.uploadVideo(dto);
      return new ResponseDto({
        payload: {
          success: true,
          data: result,
        },
      });
    } catch (error: any) {
      return new ResponseDto({
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

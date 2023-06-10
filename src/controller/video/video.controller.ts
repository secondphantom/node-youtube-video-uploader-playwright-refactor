import { ResponseDto } from "../../application/dto/response.dto";
import { UploadVideoDto } from "../../application/interfaces/browser.instance";
import { VideoService } from "../../application/service/video.service";
import { VideoControllerInterface } from "./video.interface";

export class VideoController implements VideoControllerInterface {
  static instance: VideoController | undefined;

  static getInstance = (videoService: VideoService) => {
    if (this.instance) return this.instance;
    this.instance = new VideoController(videoService);
    return this.instance;
  };

  constructor(private videoService: VideoService) {}

  uploadVideo = async (dto: UploadVideoDto) => {
    try {
      const result = await this.videoService.uploadVideo(dto);
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

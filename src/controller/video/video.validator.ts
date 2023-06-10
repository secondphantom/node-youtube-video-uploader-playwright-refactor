import { ResponseDto } from "../../application/dto/response.dto";
import { UploadVideoDto } from "../../application/interfaces/browser.instance";
import {
  VideoControllerInterface,
  VideoValidatorInterface,
} from "./video.interface";

export class VideoValidatorController implements VideoControllerInterface {
  static instance: VideoValidatorController | undefined;

  constructor(
    private videoValidator: VideoValidatorInterface,
    private videoController: VideoControllerInterface
  ) {}

  static getInstance = (
    videoValidator: VideoValidatorInterface,
    videoController: VideoControllerInterface
  ) => {
    if (this.instance) return this.instance;
    this.instance = new VideoValidatorController(
      videoValidator,
      videoController
    );
    return this.instance;
  };

  uploadVideo = async (dto: UploadVideoDto) => {
    try {
      const validDto = this.videoValidator.uploadVideo(dto);
      const result = await this.videoController.uploadVideo(validDto);
      return result;
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

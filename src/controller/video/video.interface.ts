import { ResponseDto } from "../../application/dto/response.dto";
import { UploadVideoDto } from "../../application/interfaces/browser.instance";

export interface VideoControllerInterface {
  uploadVideo: (dto: UploadVideoDto) => Promise<ResponseDto>;
}

export interface VideoValidatorControllerInterface {
  uploadVideo: (dto: UploadVideoDto) => Promise<ResponseDto>;
}

export interface VideoValidatorInterface {
  uploadVideo: (dto: UploadVideoDto) => UploadVideoDto;
}

import { ResponseDto } from "../../application/dto/response.dto";
import { UploadVideoDto } from "../../application/interfaces/browser.instance";
import { VideoControllerInterface, VideoValidatorInterface } from "./video.interface";
export declare class VideoValidatorController implements VideoControllerInterface {
    private videoValidator;
    private videoController;
    static instance: VideoValidatorController | undefined;
    constructor(videoValidator: VideoValidatorInterface, videoController: VideoControllerInterface);
    static getInstance: (videoValidator: VideoValidatorInterface, videoController: VideoControllerInterface) => VideoValidatorController;
    uploadVideo: (dto: UploadVideoDto) => Promise<ResponseDto<any>>;
}

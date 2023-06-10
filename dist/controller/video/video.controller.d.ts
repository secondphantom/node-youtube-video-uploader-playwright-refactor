import { ResponseDto } from "../../application/dto/response.dto";
import { UploadVideoDto } from "../../application/interfaces/browser.instance";
import { VideoService } from "../../application/service/video.service";
import { VideoControllerInterface } from "./video.interface";
export declare class VideoController implements VideoControllerInterface {
    private videoService;
    static instance: VideoController | undefined;
    static getInstance: (videoService: VideoService) => VideoController;
    constructor(videoService: VideoService);
    uploadVideo: (dto: UploadVideoDto) => Promise<ResponseDto<import("../../application/interfaces/browser.instance").VideoIdSchema> | ResponseDto<{
        message: any;
    }>>;
}

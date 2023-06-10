import { ResponseDto } from "../dto/response.dto";
import { BrowserInstance, UploadVideoDto } from "../interfaces/browser.instance";
export declare class VideoService {
    private browserInstance;
    static instance: VideoService | undefined;
    static getInstance: (browserInstance: BrowserInstance) => VideoService;
    constructor(browserInstance: BrowserInstance);
    uploadVideo: (dto: UploadVideoDto) => Promise<ResponseDto<import("../interfaces/browser.instance").VideoIdSchema> | ResponseDto<{
        message: any;
    }>>;
}

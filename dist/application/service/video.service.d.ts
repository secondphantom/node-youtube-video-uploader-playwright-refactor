import { BrowserInstance, UploadVideoDto } from "../interfaces/browser.instance";
export declare class VideoService {
    private browserInstance;
    static instance: VideoService | undefined;
    static getInstance: (browserInstance: BrowserInstance) => VideoService;
    constructor(browserInstance: BrowserInstance);
    uploadVideo: (dto: UploadVideoDto) => Promise<import("../interfaces/browser.instance").VideoIdSchema>;
}

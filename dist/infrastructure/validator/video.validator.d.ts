import { UploadVideoDto } from "../../application/interfaces/browser.instance";
import { VideoValidatorInterface } from "../../controller/video/video.interface";
export declare class VideoValidator implements VideoValidatorInterface {
    static instance: VideoValidator | undefined;
    static getInstance: () => VideoValidator;
    private videoFileSchema;
    private videoMetaSchema;
    private uploadConfigSchema;
    private uploadVideoDto;
    uploadVideo: (dto: UploadVideoDto) => {
        filePath: {
            video: string;
            thumbnail?: string | undefined;
        };
        meta: {
            title: string;
            description?: string | undefined;
            tags?: string[] | undefined;
            playlist?: string[] | undefined;
        };
        config?: {
            visibility?: "public" | "unlisted" | "private" | "schedule" | undefined;
            schedule?: Date | undefined;
            notifySubscribers?: boolean | undefined;
        } | undefined;
    };
}

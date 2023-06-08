export declare class VideoService {
    static instance: VideoService | undefined;
    static getInstance: () => VideoService;
    uploadVideo: () => void;
    deleteVideo: () => void;
    updateVideo: () => void;
}

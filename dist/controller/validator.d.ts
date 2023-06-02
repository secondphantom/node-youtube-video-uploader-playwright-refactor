type VideoSchema = {
    videoPath: string;
    title: string;
    description?: string;
    thumbnailPath?: string;
    playlist?: string[];
    tags?: string[];
};
type UploadSchema = {
    visibility?: "public" | "unlisted" | "private";
    schedule?: never;
} | {
    visibility?: never;
    schedule?: Date;
};
type CommentSchema = {
    videoId: string;
    comment: string;
    isPin?: boolean;
};
type UploadVideoInput = {
    video: VideoSchema;
    upload?: UploadSchema;
};
export declare class Validator {
    static instance: Validator | undefined;
    static getInstance: () => Validator;
    private videoSchema;
    private uploadSchema;
    uploadVideo: (dto: UploadVideoInput) => {
        video: {
            videoPath: string;
            title: string;
            description?: string | undefined;
            thumbnailPath?: string | undefined;
            playlist?: string[] | undefined;
            tags?: string[] | undefined;
        };
        upload: {
            visibility?: "public" | "unlisted" | "private" | undefined;
            schedule?: Date | undefined;
        } | undefined;
    };
    private commentSchema;
    commentAtVideo: (dto: CommentSchema) => {
        videoId: string;
        comment: string;
        isPin?: boolean | undefined;
    };
}
export {};

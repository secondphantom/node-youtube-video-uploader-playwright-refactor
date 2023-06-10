import { Page } from "playwright";
import { PlaywrightInstance } from "./playwright.instance";
import { UploadVideoDto } from "../../application/interfaces/browser.instance";
export declare class PlaywrightUpload {
    private playwrightInstance;
    static instance: PlaywrightUpload | undefined;
    static getInstance: (playwrightInstance: PlaywrightInstance) => PlaywrightUpload;
    constructor(playwrightInstance: PlaywrightInstance);
    uploadVideo: (page: Page, dto: UploadVideoDto) => Promise<{
        videoId: string;
    }>;
    private setVideoFile;
    private setDetailInfoTab;
    private setPlaylistAtUpload;
    private getPlaylistEle;
    private setPlaylistEle;
    private setEachPlaylist;
    private createPlaylist;
    private getVideoId;
    private setMonetizeTab;
    private checkIsMonetizeTab;
    private monetizeCommand;
    private setVisibilityTab;
    private setVisibilitySchedule;
    private getIntlFormatDateTime;
    private closeDialog;
}

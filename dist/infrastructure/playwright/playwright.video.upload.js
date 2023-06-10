"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaywrightUpload = void 0;
const common_method_1 = require("../common.method");
class PlaywrightUpload {
    playwrightInstance;
    static instance;
    static getInstance = (playwrightInstance) => {
        if (this.instance)
            return this.instance;
        this.instance = new PlaywrightUpload(playwrightInstance);
        return this.instance;
    };
    constructor(playwrightInstance) {
        this.playwrightInstance = playwrightInstance;
    }
    uploadVideo = async (page, dto) => {
        await this.setVideoFile(page, dto);
        // setDetailInfoTab
        await this.setDetailInfoTab(page, dto);
        const videoId = await this.getVideoId(page);
        // set monetizetab
        await this.setMonetizeTab(page);
        // set visibilitytab
        await this.setVisibilityTab(page, dto);
        // close
        await this.closeDialog(page);
        return {
            videoId,
        };
    };
    setVideoFile = async (page, dto) => {
        const { filePath } = dto;
        await this.playwrightInstance.existClick({
            page,
            querySelector: "#create-icon",
            delayMs: 500,
            maxTryCount: 20,
        });
        await this.playwrightInstance.existClick({
            page,
            querySelector: "#text-item-0",
        });
        await this.playwrightInstance.fileChoose({
            page,
            querySelector: "#select-files-button",
            filePath: filePath.video,
        });
    };
    setDetailInfoTab = async (page, dto) => {
        const { meta: { title, description, playlist, tags }, config, filePath, } = dto;
        //click tab
        await this.playwrightInstance.existClick({
            page,
            querySelector: `button[test-id="DETAILS"]`,
            delayMs: 1000,
            maxTryCount: 20,
        });
        //set title
        await this.playwrightInstance.existFill({
            page,
            querySelector: "#title-textarea #child-input #textbox",
            inputStr: title,
        });
        //set thumbnail
        if (filePath.thumbnail !== undefined) {
            await this.playwrightInstance.fileChoose({
                page,
                querySelector: "#add-photo-icon",
                filePath: filePath.thumbnail,
            });
        }
        //set description
        if (description !== undefined) {
            await this.playwrightInstance.existFill({
                page,
                querySelector: "#description-textarea #child-input #textbox",
                inputStr: description,
            });
        }
        //set playlist
        if (playlist && playlist.length !== 0) {
            await this.setPlaylistAtUpload(page, playlist);
        }
        //set tags
        if (tags && tags.length !== 0) {
            await this.playwrightInstance.existClick({
                page,
                querySelector: "ytcp-video-metadata-editor #toggle-button",
            });
            await this.playwrightInstance.existFill({
                page,
                querySelector: "#chip-bar #text-input",
                inputStr: tags.join(","),
            });
        }
        //set notify
        if (!config)
            return;
        const { notifySubscribers } = config;
        if (notifySubscribers !== undefined && !notifySubscribers) {
            await this.playwrightInstance.existClick({
                page,
                querySelector: "#notify-subscribers",
            });
        }
    };
    setPlaylistAtUpload = async (page, playlist) => {
        const playListEle = await this.getPlaylistEle(page);
        await this.setPlaylistEle(page, playlist, playListEle);
        await this.playwrightInstance.existClick({
            page,
            querySelector: `.done-button.ytcp-playlist-dialog`,
        });
    };
    getPlaylistEle = async (page) => {
        await this.playwrightInstance.existClick({
            page,
            querySelector: 'ytcp-video-metadata-editor-basics [icon="icons:arrow-drop-down"]',
        });
        let playlistEle;
        let tryCount = 0;
        const maxTryCount = 10;
        while (true) {
            playlistEle = await page.$$("#playlists-list #items .checkbox-label span.ytcp-checkbox-group");
            if (playlistEle.length !== 0)
                break;
            ++tryCount;
            if (tryCount >= maxTryCount)
                break;
            await (0, common_method_1.delay)(1000);
        }
        return playlistEle;
    };
    setPlaylistEle = async (page, playlist, playlistEle) => {
        for (const playlistName of playlist) {
            const setPlaylist = await this.setEachPlaylist(playlistName, playlistEle);
            if (setPlaylist)
                continue;
            await this.createPlaylist(page, playlistName);
        }
    };
    setEachPlaylist = async (playlistName, playlistEle) => {
        let setPlaylist = false;
        for (const ele of playlistEle) {
            const curPlayListName = await ele.innerText();
            if (curPlayListName !== playlistName)
                continue;
            await ele.click();
            setPlaylist = true;
            break;
        }
        return setPlaylist;
    };
    createPlaylist = async (page, playlistName) => {
        await this.playwrightInstance.existClick({
            page,
            querySelector: ".new-playlist-button",
        });
        await this.playwrightInstance.existClick({
            page,
            querySelector: `[test-id="new_playlist"]`,
        });
        await this.playwrightInstance.existFill({
            page,
            querySelector: "ytcp-playlist-metadata-editor #title-textarea #textbox",
            inputStr: playlistName,
        });
        await this.playwrightInstance.existClick({
            page,
            querySelector: `[id="create-button"]`,
        });
    };
    getVideoId = async (page) => {
        //click tab
        await this.playwrightInstance.existClick({
            page,
            querySelector: `button[test-id="DETAILS"]`,
        });
        //get videoId
        let videoId = "";
        while (true) {
            const rawUrl = await (await page.$(".ytcp-video-info a")).getAttribute("href");
            if (rawUrl) {
                videoId = rawUrl.match(/\/\/(.+)\/(.+)/)[2];
                break;
            }
            await (0, common_method_1.delay)(1000);
        }
        return videoId;
    };
    setMonetizeTab = async (page) => {
        const isMonetized = await this.checkIsMonetizeTab(page);
        if (!isMonetized)
            return;
        await this.monetizeCommand(page);
    };
    checkIsMonetizeTab = async (page) => {
        const monetizeBtn = await page.$(`button[test-id="MONETIZATION"]`);
        if (monetizeBtn === null)
            return false;
        return true;
    };
    monetizeCommand = async (page) => {
        await this.playwrightInstance.existClick({
            page,
            querySelector: '[test-id="MONETIZATION"]',
        });
        await this.playwrightInstance.existClick({
            page,
            querySelector: '.ytpp-video-monetization-basics [icon="icons:arrow-drop-down"]',
        });
        await this.playwrightInstance.existClick({
            page,
            querySelector: "#radio-on",
        });
        await this.playwrightInstance.existClick({
            page,
            querySelector: ".ytcp-video-monetization-edit-dialog #save-button",
        });
        await this.playwrightInstance.existClick({
            page,
            querySelector: `[test-id="CONTENT_RATINGS"]`,
        });
        await this.playwrightInstance.existClick({
            page,
            querySelector: ".ytpp-self-certification-questionnaire #checkbox-container",
        });
        while (true) {
            const ariaDisabled = await (await page.$("#submit-questionnaire-button")).getAttribute("aria-disabled");
            if (ariaDisabled === "false")
                break;
            await (0, common_method_1.delay)(500);
        }
        await this.playwrightInstance.existClick({
            page,
            querySelector: "#submit-questionnaire-button",
        });
        while (true) {
            const disabled = await (await page.$(".ytcp-uploads-content-ratings")).getAttribute("disabled");
            if (disabled === null)
                break;
            await (0, common_method_1.delay)(500);
        }
    };
    setVisibilityTab = async (page, dto) => {
        await this.playwrightInstance.existClick({
            page,
            querySelector: 'button[test-id="REVIEW"]',
        });
        const { config } = dto;
        if (!config)
            return;
        const { visibility, schedule } = config;
        switch (visibility) {
            case "private":
                await this.playwrightInstance.existClick({
                    page,
                    querySelector: 'tp-yt-paper-radio-button[name="PRIVATE"]',
                });
                return;
            case "unlisted":
                await this.playwrightInstance.existClick({
                    page,
                    querySelector: 'tp-yt-paper-radio-button[name="UNLISTED"]',
                });
                return;
            case "public":
                await this.playwrightInstance.existClick({
                    page,
                    querySelector: 'tp-yt-paper-radio-button[name="public"]',
                });
                return;
            case "schedule":
                if (!schedule) {
                    throw new Error(`[ERROR] BrowserInstance: If you want to set visibility='schedule', Need schedule date param`);
                }
                await this.setVisibilitySchedule(page, schedule);
                return;
        }
    };
    setVisibilitySchedule = async (page, schedule) => {
        const { scheduleDate, scheduleTime } = this.getIntlFormatDateTime(schedule);
        await this.playwrightInstance.existClick({
            page,
            querySelector: "#schedule-radio-button",
        });
        await this.playwrightInstance.existClick({
            page,
            querySelector: "#datepicker-trigger",
        });
        await this.playwrightInstance.existFill({
            page,
            querySelector: ".ytcp-date-picker .tp-yt-paper-input input",
            inputStr: scheduleDate,
        });
        await page.keyboard.down("Enter");
        await this.playwrightInstance.existFill({
            page,
            querySelector: ".ytcp-datetime-picker .tp-yt-paper-input input",
            inputStr: scheduleTime,
        });
        await page.keyboard.down("Enter");
    };
    getIntlFormatDateTime = (schedule) => {
        const youtubeLocale = this.playwrightInstance.getYoutubeLocale();
        if (schedule <= new Date())
            throw new Error("need schedule time in the future.");
        const dateFormat = new Intl.DateTimeFormat(youtubeLocale, {
            dateStyle: "medium",
        });
        const timeFormat = new Intl.DateTimeFormat(youtubeLocale, {
            timeStyle: "short",
        });
        const scheduleDate = dateFormat.format(schedule);
        const scheduleTime = timeFormat.format(schedule);
        return {
            scheduleDate,
            scheduleTime,
        };
    };
    closeDialog = async (page) => {
        await this.playwrightInstance.existClick({
            page,
            querySelector: "#done-button",
        });
        await this.playwrightInstance.existClick({
            page,
            querySelector: "ytcp-prechecks-warning-dialog #primary-action-button",
            delayMs: 500,
            maxTryCount: 5,
            throwError: false,
        });
        await this.playwrightInstance.existClick({
            page,
            querySelector: ".ytcp-uploads-still-processing-dialog #close-button",
            delayMs: 500,
            maxTryCount: 5,
            throwError: false,
        });
    };
}
exports.PlaywrightUpload = PlaywrightUpload;
//# sourceMappingURL=playwright.video.upload.js.map
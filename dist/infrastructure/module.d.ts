import { LaunchOptions } from "playwright";
export interface YoutubeUploaderConfig {
    cookiesFilePath: string;
    channelId: string;
    youtubeLocale: string;
    launchOptions?: LaunchOptions;
}

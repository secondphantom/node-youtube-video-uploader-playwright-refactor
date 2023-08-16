import {
  BrowserInstance,
  ReloadPageDto,
  UploadVideoDto,
} from "../interfaces/browser.instance";

export class BrowserService {
  static instance: BrowserService | undefined;

  static getInstance = (browserInstance: BrowserInstance) => {
    if (this.instance) return this.instance;
    this.instance = new BrowserService(browserInstance);
    return this.instance;
  };

  constructor(private browserInstance: BrowserInstance) {}

  reloadPage = async (dto: ReloadPageDto) => {
    await this.browserInstance.reloadPage(dto);
  };
}

import { ResponseDto } from "../../application/dto/response.dto";
import { ReloadPageDto } from "../../application/interfaces/browser.instance";
import { BrowserService } from "../../application/service/browser.service";
import { BrowserControllerInterface } from "./browser.interface";

export class BrowserController implements BrowserControllerInterface {
  static instance: BrowserController | undefined;

  static getInstance = (browserService: BrowserService) => {
    if (this.instance) return this.instance;
    this.instance = new BrowserController(browserService);
    return this.instance;
  };

  constructor(private browserService: BrowserService) {}

  reloadPage = async (dto: ReloadPageDto) => {
    try {
      const result = await this.browserService.reloadPage(dto);
      return new ResponseDto({
        payload: {
          success: true,
          data: result,
        },
      });
    } catch (error: any) {
      return new ResponseDto({
        payload: {
          success: false,
          data: {
            message: error.message,
          },
        },
      });
    }
  };
}

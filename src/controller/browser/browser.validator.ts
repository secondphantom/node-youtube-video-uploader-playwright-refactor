import { ResponseDto } from "../../application/dto/response.dto";
import {
  ReloadPageDto,
  UploadVideoDto,
} from "../../application/interfaces/browser.instance";
import {
  BrowserControllerInterface,
  BrowserValidatorInterface,
} from "./browser.interface";

export class BrowserValidatorController implements BrowserControllerInterface {
  static instance: BrowserValidatorController | undefined;

  constructor(
    private browserValidator: BrowserValidatorInterface,
    private browserController: BrowserControllerInterface
  ) {}

  static getInstance = (
    browserValidator: BrowserValidatorInterface,
    browserController: BrowserControllerInterface
  ) => {
    if (this.instance) return this.instance;
    this.instance = new BrowserValidatorController(
      browserValidator,
      browserController
    );
    return this.instance;
  };

  reloadPage = async (dto: ReloadPageDto) => {
    try {
      const validDto = this.browserValidator.reloadPage(dto);
      const result = await this.browserController.reloadPage(validDto);
      return result;
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

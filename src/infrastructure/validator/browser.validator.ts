import {
  ReloadPageDto,
  UploadVideoDto,
  VideoFileSchema,
} from "../../application/interfaces/browser.instance";
import { BrowserValidatorInterface } from "../../controller/browser/browser.interface";
import { VideoValidatorInterface } from "../../controller/video/video.interface";
import z from "zod";
import { fromZodError } from "zod-validation-error";

export class BrowserValidator implements BrowserValidatorInterface {
  static instance: BrowserValidator | undefined;
  static getInstance = () => {
    if (this.instance) return this.instance;
    this.instance = new BrowserValidator();
    return this.instance;
  };

  private reloadPageDto = z.object({
    page: z.union([z.literal("video"), z.literal("comment")]),
  });

  reloadPage = (dto: ReloadPageDto) => {
    try {
      const result = this.reloadPageDto.parse(dto);
      return result;
    } catch (error: any) {
      const validationError = fromZodError(error);
      throw new Error(validationError.message);
    }
  };
}

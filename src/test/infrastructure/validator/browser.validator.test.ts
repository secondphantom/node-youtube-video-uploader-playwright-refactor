import {
  UploadVideoDto,
  VideoFileSchema,
} from "../../../application/interfaces/browser.instance";
import { BrowserValidator } from "../../../infrastructure/validator/browser.validator";

describe("Browser Zod Validator", () => {
  let browserValidator: BrowserValidator;
  beforeAll(() => {
    browserValidator = BrowserValidator.getInstance();
  });
  describe("reloadPage", () => {
    test.each<{
      params: any;
      message: string;
      isError: boolean;
    }>([
      {
        params: {
          page: "video",
        },
        message: "valid",
        isError: false,
      },
      {
        params: {
          page: "comment",
        },
        message: "valid",
        isError: false,
      },
      {
        params: {
          // page: "comment123123",
        },
        message: "page type required",
        isError: true,
      },
      {
        params: {
          page: "comment123123",
        },
        message: "page type not valid",
        isError: true,
      },
    ])(`$message`, ({ params, isError }) => {
      const checkErrorFn = jest.fn();
      try {
        const result = browserValidator["reloadPageDto"].parse(params);
        expect(result).toEqual(params);
      } catch (e) {
        checkErrorFn();
      }
      if (isError) {
        expect(checkErrorFn).toBeCalled();
      } else {
        expect(checkErrorFn).not.toBeCalled();
      }
    });
  });
});

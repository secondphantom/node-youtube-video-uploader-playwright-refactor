import {
  UploadVideoDto,
  VideoFileSchema,
} from "../../../application/interfaces/browser.instance";
import { VideoValidator } from "../../../infrastructure/validator/video.validator";

describe("Video Zod Validator", () => {
  let videoValidator: VideoValidator;
  beforeAll(() => {
    videoValidator = VideoValidator.getInstance();
  });
  describe.skip("videoFileSchema", () => {
    test.each<{
      params: any;
      message: string;
      isError: boolean;
    }>([
      {
        params: {
          video: "video",
          thumbnail: "thumbnail",
        },
        message: "valid",
        isError: false,
      },
      {
        params: {
          video: "video",
        },
        message: "valid",
        isError: false,
      },
      {
        params: {
          thumbnail: "thumbnail",
        },
        message: "video required",
        isError: true,
      },
      {
        params: {
          video: 124123,
        },
        message: "invalid video input type",
        isError: true,
      },
      {
        params: {
          thumbnail: 124123,
        },
        message: "invalid thumbnail input type",
        isError: true,
      },
    ])(`$message`, ({ params, isError }) => {
      const checkErrorFn = jest.fn();
      try {
        const result = videoValidator["videoFileSchema"].parse(params);
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

  describe.skip("videoMetaSchema", () => {
    test.each<{
      params: any;
      message: string;
      isError: boolean;
    }>([
      {
        params: {
          title: "title",
          description: "description",
          tags: ["tag1", "tag2"],
          playlist: ["playlist1", "playlist2"],
        },
        message: "valid",
        isError: false,
      },
      {
        params: {
          title: "title",
        },
        message: "valid optional params",
        isError: false,
      },
      {
        params: {
          description: "description",
          tags: ["tag1", "tag2"],
          playlist: ["playlist1", "playlist2"],
        },
        message: "invalid required title",
        isError: true,
      },
      {
        params: {
          title: 2314,
          description: "description",
          tags: ["tag1", "tag2"],
          playlist: ["playlist1", "playlist2"],
        },
        message: "invalid title",
        isError: true,
      },
      {
        params: {
          title: "title",
          description: 123141,
          tags: ["tag1", "tag2"],
          playlist: ["playlist1", "playlist2"],
        },
        message: "invalid description",
        isError: true,
      },
      {
        params: {
          title: "title",
          description: "description",
          tags: ["tag1", 124],
          playlist: ["playlist1", "playlist2"],
        },
        message: "invalid tags type",
        isError: true,
      },
      {
        params: {
          title: "title",
          description: "description",
          tags: 1234123,
          playlist: ["playlist1", "playlist2"],
        },
        message: "valid tag type",
        isError: true,
      },
      {
        params: {
          title: "title",
          description: "description",
          tags: ["tag1", "tag2"],
          playlist: [1234123, "playlist2"],
        },
        message: "invalid playlist type",
        isError: true,
      },
      {
        params: {
          title: "title",
          description: "description",
          tags: ["tag1", "tag2"],
          playlist: 1234124,
        },
        message: "invalid playlist type",
        isError: true,
      },
    ])(`$message`, ({ params, isError }) => {
      const checkErrorFn = jest.fn();
      try {
        const result = videoValidator["videoMetaSchema"].parse(params);
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

  describe.only("uploadConfigSchema", () => {
    test.each<{
      params: any;
      message: string;
      isError: boolean;
    }>([
      {
        params: {
          visibility: "public",
          // schedule: new Date(),
          notifySubscribers: false,
        },
        message: "valid",
        isError: false,
      },

      {
        params: {
          visibility: "unlisted",
          notifySubscribers: false,
        },
        message: "valid",
        isError: false,
      },
      {
        params: {
          visibility: "private",
          notifySubscribers: false,
        },
        message: "valid",
        isError: false,
      },
      {
        params: {
          visibility: "schedule",
          schedule: new Date("2040-05-05"),
          notifySubscribers: false,
        },
        message: "valid",
        isError: false,
      },
      {
        params: {},
        message: "valid",
        isError: false,
      },
      {
        params: {
          visibility: "schedule",
          schedule: new Date(),
          notifySubscribers: false,
        },
        message: "schedule date in the future",
        isError: true,
      },
      {
        params: {
          visibility: "test",
          schedule: new Date(),
          notifySubscribers: false,
        },
        message: "valid visibility union",
        isError: true,
      },
      {
        params: {
          visibility: 1234123,
          schedule: new Date(),
          notifySubscribers: false,
        },
        message: "invalid visibility type",
        isError: true,
      },
      {
        params: {
          visibility: "public",
          schedule: 12341,
          notifySubscribers: false,
        },
        message: "invalid schedule type",
        isError: true,
      },
      {
        params: {
          visibility: "public",
          notifySubscribers: 12341,
        },
        message: "invalid notifySubscribers type",
        isError: true,
      },
    ])(`$message`, ({ params, isError }) => {
      const checkErrorFn = jest.fn();
      try {
        const result = videoValidator["uploadConfigSchema"].parse(params);
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

  describe.skip("Upload Video Dto", () => {
    test.each<{
      params: any;
      message: string;
      isError: boolean;
    }>([
      {
        params: {
          filePath: {
            video: "video file path",
            thumbnail: "thumbnail file path",
          },
          config: {
            visibility: "private",
            notifySubscribers: false,
            schedule: new Date(),
          },
          meta: {
            title: "title",
            description: "description",
            playlist: ["playlist"],
            tags: ["tags"],
          },
        },
        message: "Valid",
        isError: false,
      },
      {
        params: {
          filePath: {
            video: "video file path",
            thumbnail: "thumbnail file path",
          },
          meta: {
            title: "title",
            description: "description",
            playlist: ["playlist"],
            tags: ["tags"],
          },
        },
        message: "Valid",
        isError: false,
      },
      {
        params: {
          config: {
            visibility: "private",
            notifySubscribers: false,
            schedule: new Date(),
          },
          meta: {
            title: "title",
            description: "description",
            playlist: ["playlist"],
            tags: ["tags"],
          },
        },
        message: "invalid required filepath",
        isError: true,
      },
    ])(`$message`, ({ params, isError }) => {
      const checkErrorFn = jest.fn();
      try {
        const result = videoValidator.uploadVideo(params as any);
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

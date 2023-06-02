import { before, describe } from "node:test";
import { Validator } from "../controller/validator";

describe("Validate Params", () => {
  let validator: Validator;

  beforeAll(() => {
    validator = Validator.getInstance();
  });

  describe("Upload Video", () => {
    test("Valid Input", () => {
      const dto = {
        video: {
          videoPath: "/video/file/path.mp4",
          title: "test title",
          description: "test description",
          thumbnailPath: "/file/test.jpg",
          playlist: ["palylist1", "playlist2"],
          tags: ["tag1", "tag2"],
        },
        upload: {
          visibility: "public",
          schedule: new Date(),
        },
      };

      const result = validator.uploadVideo(dto as any);
      expect(result).toEqual(expect.anything());
    });

    test.each([
      {
        dto: {
          video: {
            // videoPath: "/video/file/path.mp4",
            title: "test title",
            description: "test description",
            thumbnailPath: "/file/test.jpg",
            playlist: ["palylist1", "playlist2"],
            tags: ["tag1", "tag2"],
          },
        },
        message: "Required dto Error",
      },
      {
        dto: {
          video: {
            videoPath: "/video/file/path.mp4",
            title: 12313,
            description: "test description",
            thumbnailPath: "/file/test.jpg",
            playlist: ["palylist1", "playlist2"],
            tags: ["tag1", "tag2"],
          },
        },
        message: "Wrong Type dto Error",
      },
    ])(`$message`, ({ dto }) => {
      let error;
      try {
        validator.uploadVideo(dto as any);
      } catch (e) {
        error = e;
      }
      expect(error).toEqual(expect.anything());
    });
  });

  describe("Comment at Video", () => {
    test("Valid Input", () => {
      const dto = {
        videoId: "videoId",
        comment: "test comment",
        isPin: true,
      };

      const result = validator.commentAtVideo(dto as any);
      expect(result).toEqual(expect.anything());
    });

    test.each([
      {
        dto: {
          // videoId: "videoId",
          comment: "test comment",
          isPin: true,
        },
        message: "Required dto Error",
      },
      {
        dto: {
          videoId: "videoId",
          comment: "test comment",
          isPin: "string",
        },
        message: "Wrong Type dto Error",
      },
    ])(`$message`, ({ dto }) => {
      let error;
      try {
        validator.uploadVideo(dto as any);
      } catch (e) {
        error = e;
      }
      expect(error).toEqual(expect.anything());
    });
  });
});

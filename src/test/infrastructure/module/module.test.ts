import { delay } from "../../../infrastructure/common.method";
import { YoutubeUtil } from "../../../infrastructure/module/module";
import dotenv from "dotenv";
dotenv.config();

describe("Module Test", () => {
  const youtubeUtil = new YoutubeUtil({
    channelId: process.env.CHANNEL_ID!,
    cookiesFilePath: "./exclude/test-cookies.json",
    youtubeLocale: "ko-KR",
    launchOptions: {
      headless: false,
    },
  });

  describe("Login", () => {
    test("valid login", async () => {
      const { isLogin } = await youtubeUtil.login();
      expect(isLogin).toEqual(true);
    }, 120000);
  });

  describe("Video", () => {
    test("Upload Video", async () => {
      const { videoId } = await youtubeUtil.uploadVideo({
        meta: {
          title: "테스트",
          description: "테스트 설명",
          tags: ["테그1", "테그2"],
        },
        filePath: {
          video: "./video.mp4",
          thumbnail: "./thumbnail.jpg",
        },
        config: {
          visibility: "private",
          notifySubscribers: false,
        },
      });

      console.log(videoId);
      expect(videoId).toEqual(expect.any(String));
    }, 120000);
  });
});

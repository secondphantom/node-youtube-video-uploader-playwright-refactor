import { delay } from "../../../infrastructure/common.method";
import { YoutubeUtil } from "../../../infrastructure/module/module";
import dotenv from "dotenv";
dotenv.config();

describe("Module Test", () => {
  const youtubeUtil = new YoutubeUtil({
    channelId: process.env.CHANNEL_ID!,
    authFilePath: process.env.AUTH_FILE_PATH!,
    youtubeLocale: "ko-KR",
    pages: ["video"],
    launchOptions: {
      // headless: false,
    },
  });

  describe.only("Login", () => {
    test("valid login", async () => {
      const { isLogin } = await youtubeUtil.login();
      expect(isLogin).toEqual(true);
    }, 120000);
  });

  describe.skip("Browser", () => {
    test("Reload Page", async () => {
      await youtubeUtil.login();
      try {
        await youtubeUtil.uploadVideo({
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
            visibility: "schedule",
            schedule: new Date(),
          },
        });
      } catch (error) {
        console.log(error);
        await youtubeUtil.reloadPage({ page: "video" });
      }
      await delay(50000);
    }, 120000);
  });

  describe.skip("Video", () => {
    test("Upload Video", async () => {
      await youtubeUtil.login();
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

# youtube-video-uploader-playwright

This library support uploading videos on youtube by [playwright](https://playwright.dev/).

- [youtube-video-uploader-playwright](#youtube-video-uploader-playwright)
	- [Introduction](#introduction)
	- [Feature](#feature)
	- [Example](#example)
	- [Usage](#usage)
		- [New Class](#new-class)
		- [Login](#login)
		- [Upload](#upload)
			- [Video Input](#video-input)
			- [Upload Video](#upload-video)

## Introduction
The YouTube Data API default quota is 10000 points. And the upload video API consumes 1600 points. 
The default quota was too small, so I considered uploading a video to a 'crawler ([playwright](https://playwright.dev/))'.
## Feature
*check is supported*
- browser
  - [x] headless
- video
  - [x] upload
  - [ ] bulk upload
  - [ ] update
- comment
  - [ ] create
  - [ ] pin

## Example
***Please add .gitignore for 'authFilePath' path.***

```ts
const youtubeUtilConfig = {
	authFilePath: "/auth.json";
	channelId: '_w_XCecvZ3GgxabnIz-w';
	youtubeLocale: 'ko';
	pages: ["video"];
	launchOptions: {
    headless: true,
  },;
}
const youtubeUtil = new YoutubeUtil(youtubeUtilConfig)

await youtubeUtil.login();

const uploadVideoDto = {
	meta: {
		title: "title",
		description: "description",
		playlist: ["playlist", "playlist2"],
		tags: ["tag1", "tag12"],
	},
	filePath: {
		video: "./video.mp4",
		thumbnail: "./thumbnail.jpg",
	},
	config: {
		visibility: "schedule",
		notifySubscribers: false,
		schedule: new Date(),
	},
};
await youtubeUtil.upload(uploadVideoDto);
```

## Usage
***Please add .gitignore for 'authFilePath' path.***
### New Class
- playwright [launch options](https://playwright.dev/docs/api/class-browsertype#browser-type-launch-persistent-context) headless `true` and `false` support

```ts
interface YoutubeUtilConfig {
	// Please add .gitignore for 'authFilePath' path
	authFilePath: string;
	// example: UC_w_XCecvZ3GgxabnIz-w
	channelId: string;
	// for schedule date
	youtubeLocale: string;
	// browser tab
	pages?: ("video" | "comment")[];
	// playwright launch option 
	// https://playwright.dev/docs/api/class-browsertype#browser-type-launch-persistent-context
	// headless true support
	launchOptions?: LaunchOptions;
}

const youtubeUtilConfig:YoutubeUtilConfig = {
	authFilePath: "/auth.json";
	channelId: 'UC_w_XCecvZ3GgxabnIz-w';
	youtubeLocale: 'ko';
	pages?: ["video"];
	launchOptions?: {
    headless: true,
  },;
}

const youtubeUtil = new YoutubeUtil(youtubeUtilConfig)
```

### Login
- If you initialize the `YoutubeUploader` class for the first time, you should get `user data` for your YouTube channel.
- When you first run the `login` method, the browser automatically opens for YouTube login. If you are logged in to a YouTube channel, type 'enter' in `CLI`.

```ts
await youtubeUploader.login();
```

### Upload
#### Video Input

```ts
interface UploadVideoDto {
  filePath: {
    video: string;
    thumbnail?: string;
  };
  meta: {
    title: string;
    description?: string;
    tags?: string[];
		// auto create playlist
    playlist?: string[];
  };
  config?: {
		// default are youtube channel upload setting
    visibility?: "public" | "unlisted" | "private" | "schedule";
		// if visibility is 'schedule", it work
    schedule?: Date;
		// default true 
    notifySubscribers?: boolean;
  };
}

const uploadVideoDto:UploadVideoDto = {
	meta: {
		title: "title",
		description: "description",
		playlist: ["playlist", "playlist2"],
		tags: ["tag1", "tag12"],
	},
	filePath: {
		video: "./video.mp4",
		thumbnail: "./thumbnail.jpg",
	},
	config: {
		visibility: "schedule",
		notifySubscribers: false,
		schedule: new Date(),
	},
};
```

#### Upload Video

```ts
const { videoId } = await youtubeUtil.upload(uploadVideoDto);
```

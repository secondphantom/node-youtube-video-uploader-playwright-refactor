export class VideoService {
  static instance: VideoService | undefined;

  static getInstance = () => {
    if (this.instance) return this.instance;
    this.instance = new VideoService();
    return this.instance;
  };

  uploadVideo = () => {};

  deleteVideo = () => {};

  updateVideo = () => {};
}

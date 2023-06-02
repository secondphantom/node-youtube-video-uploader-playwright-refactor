"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const validator_1 = require("../controller/validator");
(0, node_test_1.describe)("Validate Params", () => {
    let validator;
    beforeAll(() => {
        validator = validator_1.Validator.getInstance();
    });
    (0, node_test_1.describe)("Upload Video", () => {
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
            const result = validator.uploadVideo(dto);
            console.log(result);
        });
    });
});
//# sourceMappingURL=validator.test.js.map
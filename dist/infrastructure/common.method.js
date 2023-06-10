"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = void 0;
const delay = (delayMs) => {
    return new Promise((res) => setTimeout(() => res(null), delayMs));
};
exports.delay = delay;
//# sourceMappingURL=common.method.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.intersectionOfArrays = void 0;
const fast_json_stable_stringify_1 = __importDefault(require("fast-json-stable-stringify"));
function intersectionOfArrays(a, b) {
    const output = [];
    const inA = new Set(a.map((item) => (0, fast_json_stable_stringify_1.default)(item)));
    for (const value of b) {
        if (inA.has((0, fast_json_stable_stringify_1.default)(value))) {
            output.push(value);
        }
    }
    return output;
}
exports.intersectionOfArrays = intersectionOfArrays;
//# sourceMappingURL=intersectionOfArrays.js.map
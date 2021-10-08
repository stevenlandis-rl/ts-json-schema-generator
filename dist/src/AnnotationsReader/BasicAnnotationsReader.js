"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicAnnotationsReader = void 0;
const json5_1 = __importDefault(require("json5"));
const symbolAtNode_1 = require("../Utils/symbolAtNode");
class BasicAnnotationsReader {
    constructor(extraTags) {
        this.extraTags = extraTags;
    }
    getAnnotations(node) {
        const symbol = (0, symbolAtNode_1.symbolAtNode)(node);
        if (!symbol) {
            return undefined;
        }
        const jsDocTags = symbol.getJsDocTags();
        if (!jsDocTags || !jsDocTags.length) {
            return undefined;
        }
        const annotations = jsDocTags.reduce((result, jsDocTag) => {
            const value = this.parseJsDocTag(jsDocTag);
            if (value !== undefined) {
                result[jsDocTag.name] = value;
            }
            return result;
        }, {});
        return Object.keys(annotations).length ? annotations : undefined;
    }
    parseJsDocTag(jsDocTag) {
        var _a, _b, _c;
        const text = ((_a = jsDocTag.text) !== null && _a !== void 0 ? _a : []).map((part) => part.text).join("");
        if (BasicAnnotationsReader.textTags.has(jsDocTag.name)) {
            return text;
        }
        else if (BasicAnnotationsReader.jsonTags.has(jsDocTag.name)) {
            return this.parseJson(text);
        }
        else if ((_b = this.extraTags) === null || _b === void 0 ? void 0 : _b.has(jsDocTag.name)) {
            return (_c = this.parseJson(text)) !== null && _c !== void 0 ? _c : text;
        }
        else {
            return undefined;
        }
    }
    parseJson(value) {
        try {
            return json5_1.default.parse(value);
        }
        catch (e) {
            return undefined;
        }
    }
}
exports.BasicAnnotationsReader = BasicAnnotationsReader;
BasicAnnotationsReader.textTags = new Set([
    "title",
    "description",
    "format",
    "pattern",
    "$comment",
    "contentMediaType",
    "contentEncoding",
]);
BasicAnnotationsReader.jsonTags = new Set([
    "minimum",
    "exclusiveMinimum",
    "maximum",
    "exclusiveMaximum",
    "multipleOf",
    "minLength",
    "maxLength",
    "minProperties",
    "maxProperties",
    "minItems",
    "maxItems",
    "uniqueItems",
    "propertyNames",
    "contains",
    "const",
    "examples",
    "default",
    "if",
    "then",
    "else",
    "readOnly",
    "writeOnly",
    "deprecated",
]);
//# sourceMappingURL=BasicAnnotationsReader.js.map
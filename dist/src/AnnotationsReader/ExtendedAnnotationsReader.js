"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendedAnnotationsReader = void 0;
const symbolAtNode_1 = require("../Utils/symbolAtNode");
const BasicAnnotationsReader_1 = require("./BasicAnnotationsReader");
class ExtendedAnnotationsReader extends BasicAnnotationsReader_1.BasicAnnotationsReader {
    constructor(typeChecker, extraTags) {
        super(extraTags);
        this.typeChecker = typeChecker;
    }
    getAnnotations(node) {
        const annotations = {
            ...this.getDescriptionAnnotation(node),
            ...this.getTypeAnnotation(node),
            ...super.getAnnotations(node),
        };
        return Object.keys(annotations).length ? annotations : undefined;
    }
    isNullable(node) {
        const symbol = (0, symbolAtNode_1.symbolAtNode)(node);
        if (!symbol) {
            return false;
        }
        const jsDocTags = symbol.getJsDocTags();
        if (!jsDocTags || !jsDocTags.length) {
            return false;
        }
        const jsDocTag = jsDocTags.find((tag) => tag.name === "nullable");
        return !!jsDocTag;
    }
    getDescriptionAnnotation(node) {
        const symbol = (0, symbolAtNode_1.symbolAtNode)(node);
        if (!symbol) {
            return undefined;
        }
        const comments = symbol.getDocumentationComment(this.typeChecker);
        if (!comments || !comments.length) {
            return undefined;
        }
        return {
            description: comments
                .map((comment) => comment.text.replace(/\r/g, "").replace(/(?<=[^\n])\n(?=[^\n*-])/g, " "))
                .join(" ")
                .replace(/^\s+|\s+$/g, ""),
        };
    }
    getTypeAnnotation(node) {
        var _a;
        const symbol = (0, symbolAtNode_1.symbolAtNode)(node);
        if (!symbol) {
            return undefined;
        }
        const jsDocTags = symbol.getJsDocTags();
        if (!jsDocTags || !jsDocTags.length) {
            return undefined;
        }
        const jsDocTag = jsDocTags.find((tag) => tag.name === "asType");
        if (!jsDocTag) {
            return undefined;
        }
        const text = ((_a = jsDocTag.text) !== null && _a !== void 0 ? _a : []).map((part) => part.text).join("");
        return { type: text };
    }
}
exports.ExtendedAnnotationsReader = ExtendedAnnotationsReader;
//# sourceMappingURL=ExtendedAnnotationsReader.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnionTypeFormatter = void 0;
const UnionType_1 = require("../Type/UnionType");
const uniqueArray_1 = require("../Utils/uniqueArray");
class UnionTypeFormatter {
    constructor(childTypeFormatter) {
        this.childTypeFormatter = childTypeFormatter;
    }
    supportsType(type) {
        return type instanceof UnionType_1.UnionType;
    }
    getDefinition(type) {
        const definitions = type.getTypes().map((item) => this.childTypeFormatter.getDefinition(item));
        let stringType = true;
        let oneNotEnum = false;
        for (const def of definitions) {
            if (def.type !== "string") {
                stringType = false;
                break;
            }
            if (def.enum === undefined) {
                oneNotEnum = true;
            }
        }
        if (stringType && oneNotEnum) {
            const values = [];
            for (const def of definitions) {
                if (def.enum) {
                    values.push(...def.enum);
                }
                else if (def.const) {
                    values.push(def.const);
                }
                else {
                    return {
                        type: "string",
                    };
                }
            }
            return {
                type: "string",
                enum: values,
            };
        }
        const flattenedDefinitions = [];
        for (const def of definitions) {
            if (Object.keys(def) === ["anyOf"]) {
                flattenedDefinitions.push(...def.anyOf);
            }
            else {
                flattenedDefinitions.push(def);
            }
        }
        return flattenedDefinitions.length > 1
            ? {
                anyOf: flattenedDefinitions,
            }
            : flattenedDefinitions[0];
    }
    getChildren(type) {
        return (0, uniqueArray_1.uniqueArray)(type
            .getTypes()
            .reduce((result, item) => [...result, ...this.childTypeFormatter.getChildren(item)], []));
    }
}
exports.UnionTypeFormatter = UnionTypeFormatter;
//# sourceMappingURL=UnionTypeFormatter.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TupleTypeFormatter = void 0;
const OptionalType_1 = require("../Type/OptionalType");
const RestType_1 = require("../Type/RestType");
const TupleType_1 = require("../Type/TupleType");
const notUndefined_1 = require("../Utils/notUndefined");
const uniqueArray_1 = require("../Utils/uniqueArray");
class TupleTypeFormatter {
    constructor(childTypeFormatter) {
        this.childTypeFormatter = childTypeFormatter;
    }
    supportsType(type) {
        return type instanceof TupleType_1.TupleType;
    }
    getDefinition(type) {
        var _a;
        const subTypes = type.getTypes().filter(notUndefined_1.notUndefined);
        const requiredElements = subTypes.filter((t) => !(t instanceof OptionalType_1.OptionalType) && !(t instanceof RestType_1.RestType));
        const optionalElements = subTypes.filter((t) => t instanceof OptionalType_1.OptionalType);
        const restElements = subTypes.filter((t) => t instanceof RestType_1.RestType);
        const restType = restElements.length ? restElements[0].getType().getItem() : undefined;
        const firstItemType = requiredElements.length > 0 ? requiredElements[0] : (_a = optionalElements[0]) === null || _a === void 0 ? void 0 : _a.getType();
        const isUniformArray = firstItemType &&
            requiredElements.every((item) => item.getId() === firstItemType.getId()) &&
            optionalElements.every((item) => item.getType().getId() === firstItemType.getId()) &&
            (restElements.length === 0 || (restElements.length === 1 && (restType === null || restType === void 0 ? void 0 : restType.getId()) === firstItemType.getId()));
        if (isUniformArray) {
            return {
                type: "array",
                items: this.childTypeFormatter.getDefinition(firstItemType),
                minItems: requiredElements.length,
                ...(restType ? {} : { maxItems: requiredElements.length + optionalElements.length }),
            };
        }
        const requiredDefinitions = requiredElements.map((item) => this.childTypeFormatter.getDefinition(item));
        const optionalDefinitions = optionalElements.map((item) => this.childTypeFormatter.getDefinition(item));
        const itemsTotal = requiredDefinitions.length + optionalDefinitions.length;
        const restDefinition = restType ? this.childTypeFormatter.getDefinition(restType) : undefined;
        return {
            type: "array",
            minItems: requiredDefinitions.length,
            ...(itemsTotal ? { items: requiredDefinitions.concat(optionalDefinitions) } : {}),
            ...(!itemsTotal && restDefinition ? { items: restDefinition } : {}),
            ...(!itemsTotal && !restDefinition ? { maxItems: 0 } : {}),
            ...(restDefinition && itemsTotal ? { additionalItems: restDefinition } : {}),
            ...(!restDefinition && itemsTotal ? { maxItems: itemsTotal } : {}),
        };
    }
    getChildren(type) {
        return (0, uniqueArray_1.uniqueArray)(type
            .getTypes()
            .filter(notUndefined_1.notUndefined)
            .reduce((result, item) => [...result, ...this.childTypeFormatter.getChildren(item)], []));
    }
}
exports.TupleTypeFormatter = TupleTypeFormatter;
//# sourceMappingURL=TupleTypeFormatter.js.map
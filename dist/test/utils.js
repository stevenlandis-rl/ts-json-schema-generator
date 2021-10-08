"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertValidSchema = exports.createGenerator = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const fs_1 = require("fs");
const json_stable_stringify_1 = __importDefault(require("json-stable-stringify"));
const path_1 = require("path");
const formatter_1 = require("../factory/formatter");
const parser_1 = require("../factory/parser");
const program_1 = require("../factory/program");
const SchemaGenerator_1 = require("../src/SchemaGenerator");
const validator = new ajv_1.default();
(0, ajv_formats_1.default)(validator);
const basePath = "test/valid-data";
function createGenerator(config) {
    const program = (0, program_1.createProgram)(config);
    return new SchemaGenerator_1.SchemaGenerator(program, (0, parser_1.createParser)(program, config), (0, formatter_1.createFormatter)(config), config);
}
exports.createGenerator = createGenerator;
function assertValidSchema(relativePath, type, jsDoc = "none", extraTags, schemaId) {
    return () => {
        const config = {
            path: `${basePath}/${relativePath}/*.ts`,
            type,
            jsDoc,
            extraTags,
            skipTypeCheck: !!process.env.FAST_TEST,
        };
        if (schemaId) {
            config.schemaId = schemaId;
        }
        const generator = createGenerator(config);
        const schema = generator.createSchema(type);
        const schemaFile = (0, path_1.resolve)(`${basePath}/${relativePath}/schema.json`);
        if (process.env.UPDATE_SCHEMA) {
            (0, fs_1.writeFileSync)(schemaFile, (0, json_stable_stringify_1.default)(schema, { space: 2 }) + "\n", "utf8");
        }
        const expected = JSON.parse((0, fs_1.readFileSync)(schemaFile, "utf8"));
        const actual = JSON.parse(JSON.stringify(schema));
        expect(typeof actual).toBe("object");
        expect(actual).toEqual(expected);
        let localValidator = validator;
        if (extraTags) {
            localValidator = new ajv_1.default({ strict: false });
            (0, ajv_formats_1.default)(localValidator);
        }
        localValidator.validateSchema(actual);
        expect(localValidator.errors).toBeNull();
        localValidator.compile(actual);
    };
}
exports.assertValidSchema = assertValidSchema;
//# sourceMappingURL=utils.js.map
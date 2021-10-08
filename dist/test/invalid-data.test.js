"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const formatter_1 = require("../factory/formatter");
const parser_1 = require("../factory/parser");
const program_1 = require("../factory/program");
const SchemaGenerator_1 = require("../src/SchemaGenerator");
function assertSchema(name, type, message) {
    return () => {
        const config = {
            path: (0, path_1.resolve)(`test/invalid-data/${name}/*.ts`),
            type: type,
            expose: "export",
            topRef: true,
            jsDoc: "none",
            skipTypeCheck: !!process.env.FAST_TEST,
        };
        const program = (0, program_1.createProgram)(config);
        const generator = new SchemaGenerator_1.SchemaGenerator(program, (0, parser_1.createParser)(program, config), (0, formatter_1.createFormatter)(config));
        expect(() => generator.createSchema(type)).toThrowError(message);
    };
}
describe("invalid-data", () => {
    it("script-empty", assertSchema("script-empty", "MyType", `No root type "MyType" found`));
    it("duplicates", assertSchema("duplicates", "MyType", `Type "A" has multiple definitions.`));
    it("no-function-name", assertSchema("function-parameters-declaration-missing-name", "*", `Unknown node "export default function () { }`));
});
//# sourceMappingURL=invalid-data.test.js.map
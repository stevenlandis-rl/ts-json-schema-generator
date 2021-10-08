import ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
export declare class OptionalTypeNodeParser implements SubNodeParser {
    private childNodeParser;
    constructor(childNodeParser: NodeParser);
    supportsNode(node: ts.OptionalTypeNode): boolean;
    createType(node: ts.OptionalTypeNode, context: Context): BaseType | undefined;
}

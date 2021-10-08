import { Config } from "../src/Config";
import { SchemaGenerator } from "../src/SchemaGenerator";
export declare function createGenerator(config: Config): SchemaGenerator;
export declare function assertValidSchema(relativePath: string, type?: string, jsDoc?: Config["jsDoc"], extraTags?: Config["extraTags"], schemaId?: Config["schemaId"]): () => void;

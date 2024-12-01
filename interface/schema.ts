export type FieldDefinition =
  | { [key: string]: string | FieldDefinition; }
  | string[];

export interface TypeDefinition {
  type: string;
  fields: FieldDefinition;
}

export type SupportedLanguages = 'java' | 'go' | 'typescript';

export type EndpointTypes = 'crud' | 'search';
export type Endpoints = EndpointTypes[] | Record<string, EndpointTypes[]>;

export interface JavaOptions {
  package: string;
}

export interface GoOptions {
  package: string;
}

export interface TypescriptOptions {
  type_module: string;
  endpoints_module: string;
}

export interface CompilerOptions {
  java?: JavaOptions;
  go?: GoOptions;
  typescript?: TypescriptOptions;
}

export interface Schema {
  types: TypeDefinition[];
  endpoints: Endpoints;
  compilerOptions: CompilerOptions;
}

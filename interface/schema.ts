export type FieldDefinition =
  | { [key: string]: string | FieldDefinition }
  | string[];

export interface TypeDefinition {
  type: string;
  fields: FieldDefinition;
}

export type SupportedLanguages = 'java' | 'go' | 'typescript';
export interface CompilerOptions {
  [key: string]: any;
}

export interface Schema {
  types: TypeDefinition[];
  compilerOptions: CompilerOptions;
}

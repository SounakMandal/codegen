interface FieldDefinition {
  [key: string]: string;
}

export interface TypeDefinition {
  type: string;
  fields: FieldDefinition;
}

export interface CompilerOptions {
  [key: string]: any;
}

export interface Schema {
  types: TypeDefinition[];
  compilerOptions: CompilerOptions;
}

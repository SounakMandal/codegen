export interface TemplateOptions {
  [key: string]: any;
}

export type TypeMapper = (schemaDataType: string) => string;

export type FieldConverter = (
  fieldType: string,
  fieldName: string | null,
) => string;

export type TemplateBuilder = (
  entityName: string,
  fieldInformation: string,
  options: TemplateOptions,
) => string;

export type FileFormatter = (file: string) => void;

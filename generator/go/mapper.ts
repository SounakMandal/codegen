import { exec } from 'child_process';
import { TemplateOptions } from '../../interface/mapper';
import { listDataTypeInSchema } from '../../utils/types/constants';
import { getBaseTypeOfList } from '../../utils/types/extractor';
import { convertToTitleCase } from '../generate';

export function golangDatatypeMapper(schemaDatatype: string): string {
  switch (schemaDatatype) {
    case 'string':
      return 'string';

    case 'int':
    case 'float':
    case 'double':
      return `${ schemaDatatype }64`;

    default:
      const arrayTypeMatch = listDataTypeInSchema.test(schemaDatatype);
      if (!arrayTypeMatch) return convertToTitleCase(schemaDatatype);
      return `[]${ golangDatatypeMapper(getBaseTypeOfList(schemaDatatype)) }`;
  }
}

export function convertToGolangEntityField(
  fieldType: string,
  fieldName: string,
) {
  return `${ convertToTitleCase(fieldName) } ${ fieldType } \`json:"${ fieldName }"\`\n`;
}

export function golangTemplateBuilder(
  entityName: string,
  fieldInformation: string,
  options: TemplateOptions,
) {
  const { packageName, includePackage } = options;
  let fileContents: string = `
  type ${ convertToTitleCase(entityName) } struct {
    ${ fieldInformation }
  } `;

  if (includePackage) {
    fileContents = `package ${ packageName };
    ${ fileContents }
    `;
  }
  return fileContents;
}

export function golangFormatter(file: string) {
  exec(`gofmt -w ${ file }`);
}

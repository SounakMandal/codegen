import { exec } from 'child_process';
import { TemplateOptions } from '../../interface/mapper';
import {
  getBaseTypeOfList,
  getKeyTypeOfMap,
  getValueTypeOfMap,
} from '../../utils/types/extractor';
import { convertToTitleCase } from '../../utils/file/naming';
import { isArrayType, isMapType } from '../../utils/types/matcher';

export function golangDatatypeMapper(schemaDatatype: string): string {
  switch (schemaDatatype) {
    case 'string':
      return 'string';

    case 'int':
    case 'float':
    case 'double':
      return `${ schemaDatatype }64`;

    default:
      if (isArrayType(schemaDatatype))
        return `[]${ golangDatatypeMapper(getBaseTypeOfList(schemaDatatype)) }`;
      if (isMapType(schemaDatatype))
        return `map[${ golangDatatypeMapper(getKeyTypeOfMap(schemaDatatype)) }]${ golangDatatypeMapper(getValueTypeOfMap(schemaDatatype)) }`;
      return convertToTitleCase(schemaDatatype);
  }
}

export function convertToGolangEntityField(
  fieldType: string,
  fieldName: string | null,
) {
  if (fieldName === null) return `${ fieldType.toUpperCase() }\n`;
  return `${ convertToTitleCase(fieldName) } ${ fieldType } \`json:"${ fieldName }"\`\n`;
}

export function golangTemplateBuilder(
  entityName: string,
  fieldInformation: string,
  options: TemplateOptions,
) {
  const { packageName, includePackage, enumType } = options;
  const formattedEntityName = convertToTitleCase(entityName);
  let fileContents: string = enumType
    ? `type ${ formattedEntityName } int64 \n const (${ fieldInformation
      .split('\n')
      .filter((value) => value)
      .map((value, index) => `${ value } ${ formattedEntityName } = ${ index }`)
      .join('\n') })`
    : `type ${ formattedEntityName } struct {${ fieldInformation }} `;

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

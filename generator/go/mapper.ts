import { exec } from 'child_process';
import { TemplateOptions } from '../../interface/mapper';
import {
  getBaseTypeOfList,
  getKeyTypeOfMap,
  getValueTypeOfMap,
} from '../../utils/schema/extractor';
import { convertToTitleCase } from '../../utils/file/naming';
import { isArrayType, isMapType } from '../../utils/schema/matcher';

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
      if (isMapType(schemaDatatype)) {
        const mapKeyType = golangDatatypeMapper(getKeyTypeOfMap(schemaDatatype));
        const mapValueType = golangDatatypeMapper(getValueTypeOfMap(schemaDatatype));
        if (mapKeyType in ['string', 'int64', 'float64', 'double64']) return `map[${ mapKeyType }]${ mapValueType }`;
        else return `map[*${ mapKeyType }]${ mapValueType }`;
      }
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
      .filter(value => value)
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

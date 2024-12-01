import { readFileSync } from 'fs';
import { compile } from 'handlebars';
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
        let mapKeyType = golangDatatypeMapper(getKeyTypeOfMap(schemaDatatype));
        let mapValueType = golangDatatypeMapper(getValueTypeOfMap(schemaDatatype));
        return `map[${ mapKeyType }]${ mapValueType }`;
      }
      return "*" + convertToTitleCase(schemaDatatype);
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

  const templateFile = `./template/go/${ enumType ? 'enum' : 'struct' }.hbs`;;
  const templateContent = readFileSync(templateFile, 'utf-8');
  const template = compile(templateContent, { noEscape: true });

  const templateData = {
    packageName,
    includePackage,
    formattedEntityName,
    fieldInformation: enumType ? fieldInformation
      .split('\n')
      .filter(value => value)
      .map(value => value.replace(/\*/g, ""))
      : fieldInformation
  };
  return template(templateData);
}

export function golangFormatter(file: string) {
  exec(`gofmt -w ${ file }`);
}

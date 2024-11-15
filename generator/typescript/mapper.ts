import { readFileSync } from 'fs';
import { compile } from 'handlebars';
import prettier from '@prettier/sync';
import {
  convertToCamelCase,
  convertToTitleCase,
} from '../../utils/file/naming';
import {
  getBaseTypeOfList,
  getKeyTypeOfMap,
  getValueTypeOfMap,
} from '../../utils/schema/extractor';
import { TemplateOptions } from '../../interface/mapper';
import { isArrayType, isMapType } from '../../utils/schema/matcher';

export function typescriptDatatypeMapper(schemaDatatype: string): string {
  switch (schemaDatatype) {
    case 'string':
      return 'string';

    case 'int':
    case 'float':
    case 'double':
      return 'number';

    default:
      if (isArrayType(schemaDatatype))
        return `${ typescriptDatatypeMapper(getBaseTypeOfList(schemaDatatype)) }[]`;
      if (isMapType(schemaDatatype))
        return `Map<${ typescriptDatatypeMapper(getKeyTypeOfMap(schemaDatatype)) }, ${ typescriptDatatypeMapper(getValueTypeOfMap(schemaDatatype)) }>`;
      return convertToTitleCase(schemaDatatype);
  }
}

export function convertToTypescriptEntityField(
  fieldType: string,
  fieldName: string | null,
) {
  if (fieldName === null) return `| "${ fieldType }"`;
  return `${ convertToCamelCase(fieldName) }: ${ fieldType };\n`;
}

export function typescriptTemplateBuilder(
  entityName: string,
  fieldInformation: string,
  options: TemplateOptions,
) {
  const { includePackage, typeGraph, enumType } = options;
  let imports: string = '';
  if (typeGraph) {
    const dependencyList: string[] = typeGraph[entityName];
    imports = dependencyList
      .filter(dependency => dependency !== 'list' && dependency !== 'map')
      .map(dependency => {
        const titleCaseDependency = convertToTitleCase(dependency);
        return `import {${ titleCaseDependency }} from './${ dependency }';`;
      }).join('\n');
  }

  const templateFile = `./template/typescript/${ enumType ? 'type' : 'interface' }.hbs`;;
  const templateContent = readFileSync(templateFile, 'utf-8');
  const template = compile(templateContent, { noEscape: true });

  const templateData = {
    imports,
    includePackage,
    entityName: convertToTitleCase(entityName),
    fieldInformation,
  };
  const fileContents = template(templateData);
  return prettier.format(fileContents, { parser: 'typescript' });
}

export function typescriptFormatter(file: string) { }

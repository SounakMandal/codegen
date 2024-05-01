import prettier from '@prettier/sync';
import {
  convertToCamelCase,
  convertToTitleCase,
} from '../../utils/file/naming';
import { getBaseTypeOfList } from '../../utils/types/extractor';
import { TemplateOptions } from '../../interface/mapper';
import { isArrayType } from '../../utils/types/matcher';

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
  let dependentImports: string = '';
  if (typeGraph) {
    const dependencyList = typeGraph[entityName];
    for (let index = 0; index < dependencyList.length; index++) {
      const dependency = dependencyList[index];
      if (dependency !== 'list')
        dependentImports = `${ dependentImports } import {${ convertToTitleCase(dependency) }} from './${ dependency }';`;
    }
  }

  const fileContents = enumType
    ? `${ dependentImports }

    ${ includePackage ? 'export' : '' } type ${ convertToTitleCase(entityName) } = ${ fieldInformation }`
    : `${ dependentImports }

    ${ includePackage ? 'export' : '' } interface ${ convertToTitleCase(entityName) } {${ fieldInformation }}`;
  return prettier.format(fileContents, { parser: 'typescript' });
}

export function typescriptFormatter(file: string) { }

import prettier from "@prettier/sync";
import { listDataTypeInSchema } from '../../utils/types/constants';
import { convertToCamelCase, convertToTitleCase } from '../generate';
import { getBaseTypeOfList } from '../../utils/types/extractor';
import { TemplateOptions } from '../../interface/mapper';

export function typescriptDatatypeMapper(schemaDatatype: string): string {
  switch (schemaDatatype) {
    case 'string':
      return 'string';

    case 'int':
    case 'float':
    case 'double':
      return 'number';

    default:
      const arrayTypeMatch = listDataTypeInSchema.test(schemaDatatype);
      if (!arrayTypeMatch) return convertToTitleCase(schemaDatatype);
      return `${ typescriptDatatypeMapper(getBaseTypeOfList(schemaDatatype)) }[]`;
  }
}

export function convertToTypescriptEntityField(
  fieldType: string,
  fieldName: string,
) {
  return `${ convertToCamelCase(fieldName) }: ${ fieldType };\n`;
}

export function typescriptTemplateBuilder(
  entityName: string,
  fieldInformation: string,
  options: TemplateOptions,
) {
  const { includePackage, typeGraph } = options;
  let dependentImports: string = '';
  if (typeGraph) {
    const dependencyList = typeGraph[entityName];
    for (let index = 0; index < dependencyList.length; index++) {
      const dependency = dependencyList[index];
      if (dependency !== 'list')
        dependentImports = `${ dependentImports } import {${ convertToTitleCase(dependency) }} from './${ dependency }';`;
    }
  }

  const fileContents = `
  ${ dependentImports }

  ${ includePackage ? 'export' : '' } interface ${ convertToTitleCase(entityName) } {
    ${ fieldInformation }
  }`;
  return prettier.format(fileContents, { parser: "typescript" });
}

export function typescriptFormatter(file: string) { }

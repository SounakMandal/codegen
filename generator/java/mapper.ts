import { exec } from 'child_process';
import {
  convertToCamelCase,
  convertToTitleCase,
} from '../../utils/file/naming';
import { TemplateOptions } from '../../interface/mapper';
import {
  getBaseTypeOfList,
  getKeyTypeOfMap,
  getValueTypeOfMap,
} from '../../utils/types/extractor';
import { isArrayType, isMapType } from '../../utils/types/matcher';

export function javaDatatypeMapper(schemaDatatype: string): string {
  switch (schemaDatatype) {
    case 'string':
      return 'String';

    case 'int':
    case 'float':
    case 'double':
      return schemaDatatype;

    default:
      if (isArrayType(schemaDatatype))
        return `List<${ javaDatatypeMapper(getBaseTypeOfList(schemaDatatype)) }>`;
      if (isMapType(schemaDatatype))
        return `Map<${ javaDatatypeMapper(getKeyTypeOfMap(schemaDatatype)) }, ${ javaDatatypeMapper(getValueTypeOfMap(schemaDatatype)) }>`;
      return convertToTitleCase(schemaDatatype);
  }
}

export function convertToJavaEntityField(
  fieldType: string,
  fieldName: string | null,
) {
  if (fieldName === null) return `${ fieldType.toUpperCase() },\n`;
  return `private ${ fieldType } ${ convertToCamelCase(fieldName) };\n`;
}

export function javaTemplateBuilder(
  entityName: string,
  fieldInformation: string,
  options: TemplateOptions,
) {
  const { packageName, includePackage, typeGraph, enumType } = options;
  let dependentImports: string = '';
  if (typeGraph) {
    const dependencyList = typeGraph[entityName];
    for (let index = 0; index < dependencyList.length; index++) {
      const dependency = dependencyList[index];
      if (dependency === 'list')
        dependentImports = `${ dependentImports } import java.util.List;`;
      if (dependency === 'map')
        dependentImports = `${ dependentImports } import java.util.Map;`;
    }
  }
  const imports = `
  import lombok.Data;
  ${ dependentImports }
  `;

  let fileContents: string = `@Data
  ${ includePackage ? 'public' : 'private' } ${ enumType ? 'enum' : 'class' } ${ convertToTitleCase(entityName) } {
    ${ fieldInformation }
  }`;

  if (includePackage) {
    fileContents = `package ${ packageName };
    ${ imports }
    ${ fileContents }
    `;
  }
  return fileContents;
}

export function javaFormatter(file: string) {
  const formatCommand = `java -jar ${ __dirname }/google-java-format-1.22.0-all-deps.jar --replace ${ file }`;
  exec(formatCommand);
}

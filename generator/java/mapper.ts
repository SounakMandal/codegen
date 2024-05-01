import { exec } from 'child_process';
import { listDataTypeInSchema } from '../../utils/types/constants';
import { convertToCamelCase, convertToTitleCase } from '../generate';
import { TemplateOptions } from '../../interface/mapper';
import { getBaseTypeOfList } from '../../utils/types/extractor';

export function javaDatatypeMapper(schemaDatatype: string): string {
  switch (schemaDatatype) {
    case 'string':
      return 'String';

    case 'int':
    case 'float':
    case 'double':
      return schemaDatatype;

    default:
      const arrayTypeMatch = listDataTypeInSchema.test(schemaDatatype);
      if (!arrayTypeMatch) return convertToTitleCase(schemaDatatype);
      return `List<${ javaDatatypeMapper(getBaseTypeOfList(schemaDatatype)) }>`;
  }
}

export function convertToJavaEntityField(fieldType: string, fieldName: string) {
  return `private ${ fieldType } ${ convertToCamelCase(fieldName) };\n`;
}

export function javaTemplateBuilder(
  entityName: string,
  fieldInformation: string,
  options: TemplateOptions,
) {
  const { packageName, includePackage, typeGraph } = options;
  let dependentImports: string = '';
  if (typeGraph) {
    const dependencyList = typeGraph[entityName];
    for (let index = 0; index < dependencyList.length; index++) {
      const dependency = dependencyList[index];
      if (dependency === 'list')
        dependentImports = `${ dependentImports } import java.util.List;`;
    }
  }
  const imports = `
  import lombok.Data;
  ${ dependentImports }
  `;

  let fileContents: string = `
  @Data
  ${ includePackage ? 'public' : 'private' } class ${ convertToTitleCase(entityName) } {
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

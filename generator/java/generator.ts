import { TypeDefinition } from '../../interface/schema';
import { listDataTypeInSchema } from '../../utils/constants';
import { convertToCamelCase, convertToTitleCase } from '../create';

function javaDatatypeMapper(schemaDatatype: string): string {
  switch (schemaDatatype) {
    case "string":
      return "String";

    case "int":
    case "float":
    case "double":
      return schemaDatatype;

    default:
      const arrayTypeMatch = listDataTypeInSchema.test(schemaDatatype);
      if (!arrayTypeMatch) return convertToTitleCase(schemaDatatype);

      schemaDatatype = schemaDatatype.replace("[", " ");
      schemaDatatype = schemaDatatype.replace("]", " ");
      const splitResult = schemaDatatype.split(" ");
      return `List<${ javaDatatypeMapper(splitResult[1]) }>`;
  }
}

export function javaParser(javaPackage: string, jsonTypeData: TypeDefinition): string {
  let fieldInformation = "";
  const fields = jsonTypeData["fields"];

  for (const fieldName in fields) {
    const fieldType = javaDatatypeMapper(fields[fieldName]);
    fieldInformation += `${ fieldType } ${ convertToCamelCase(fieldName) };\n`;
  }

  return `package ${ javaPackage };
  
  class ${ convertToTitleCase(jsonTypeData["type"]) } {
    ${ fieldInformation }
  }`;
}

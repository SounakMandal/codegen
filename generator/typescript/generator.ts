import { TypeDefinition } from '../../interface/schema';
import { listDataTypeInSchema } from '../../utils/constants';
import { convertToCamelCase, convertToTitleCase } from '../create';

function typescriptDatatypeMapper(schemaDatatype: string): string {
  switch (schemaDatatype) {
    case "string":
      return "string";

    case "int":
    case "float":
    case "double":
      return "number";

    default:
      const arrayTypeMatch = listDataTypeInSchema.test(schemaDatatype);
      if (!arrayTypeMatch) return convertToTitleCase(schemaDatatype);

      schemaDatatype = schemaDatatype.replace("[", " ");
      schemaDatatype = schemaDatatype.replace("]", " ");
      const splitResult = schemaDatatype.split(" ");
      return `${ typescriptDatatypeMapper(splitResult[1]) }[]`;
  };
}

export function typescriptParser(jsonTypeData: TypeDefinition): string {
  let fieldInformation = "";
  const fields = jsonTypeData["fields"];

  for (const fieldName in fields) {
    const fieldType = typescriptDatatypeMapper(fields[fieldName]);
    fieldInformation += `${ convertToCamelCase(fieldName) }: ${ fieldType };\n`;
  }

  return `interface ${ convertToTitleCase(jsonTypeData["type"]) } {
    ${ fieldInformation }
  }`;
}

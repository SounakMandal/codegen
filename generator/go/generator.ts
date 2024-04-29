import { TypeDefinition } from '../../interface/schema';
import { listDataTypeInSchema } from '../../utils/constants';
import { convertToTitleCase } from '../create';

function golangDatatypeMapper(schemaDatatype: string): string {
  switch (schemaDatatype) {
    case "string":
      return "string";

    case "int":
    case "float":
    case "double":
      return `${ schemaDatatype }64`;

    default:
      const arrayTypeMatch = listDataTypeInSchema.test(schemaDatatype);
      if (!arrayTypeMatch) return convertToTitleCase(schemaDatatype);

      schemaDatatype = schemaDatatype.replace("[", " ");
      schemaDatatype = schemaDatatype.replace("]", " ");
      const splitResult = schemaDatatype.split(" ");
      return `${ golangDatatypeMapper(splitResult[1]) }[]`;
  };
}

export function golangParser(goPackage: string, jsonTypeData: TypeDefinition): string {
  let fieldInformation = "";
  const fields = jsonTypeData["fields"];

  for (const fieldName in fields) {
    const fieldType = golangDatatypeMapper(fields[fieldName]);
    fieldInformation += `${ convertToTitleCase(fieldName) } ${ fieldType };\n`;
  }

  return `package ${ goPackage }
  
  struct ${ convertToTitleCase(jsonTypeData["type"]) } {
    ${ fieldInformation }
  }`;
}

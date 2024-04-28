import { TypedFlags } from 'meow';
import { Schema, TypeDefinition } from '../interface/schema';
import { listDataTypeInSchema } from './constants';

function extractCustomTypesFromSchema(dtoInformation: TypeDefinition[]) {
  let customTypes: string[] = [];
  for (let index = 0; index < dtoInformation.length; index++) {
    customTypes = [...customTypes, dtoInformation[index]["type"]];
  }
  return customTypes;
}

function validateType(customTypes: string[], typeValue: string) {
  if (customTypes.includes(typeValue)) return true;
  if (["string", "int", "float", "double"].includes(typeValue)) return true;
  if (!listDataTypeInSchema.test(typeValue)) return false;
  typeValue = typeValue.replace("[", " ");
  typeValue = typeValue.replace("]", " ");
  const splitResult = typeValue.split(" ");
  return validateType(customTypes, splitResult[1]);
}

function validateSchema(output: string, jsonSchema: Schema) {
  const dtoInformation = jsonSchema["dto"];
  const compilerOptions = jsonSchema["compilerOptions"];
  let error = false;
  let logMessage = "";

  switch (output) {
    case "java":
      if (compilerOptions === undefined || compilerOptions[output] === undefined || compilerOptions[output]["package"] === undefined) {
        error = true;
        logMessage += "compilerOptions.java.package is mandatory when --output is java";
      }
      break;
  }

  const customTypes = extractCustomTypesFromSchema(dtoInformation);
  for (let index = 0; index < dtoInformation.length; index++) {
    const fields = dtoInformation[index]["fields"];
    for (const fieldName in fields) {
      const typeValue = fields[fieldName];
      const typeValid = validateType(customTypes, typeValue);
      if (!typeValid) {
        error = true;
        logMessage += `Invalid datatype ${ typeValue } obtained\n`;
      }
    }
  }
  return { error, logMessage };
}

function validateCommand(flags: TypedFlags<any>) {
  let error = false;
  let logMessage = "";
  const { file, output, typescriptOut, javaOut } = flags as { [key: string]: string | boolean; };

  if (file === undefined) {
    logMessage += "--file is a mandatory arguement\n";
    error = true;
  }

  if (output === undefined) {
    logMessage += "--output is a mandatory arguement\n";
    error = true;
  }

  switch (output) {
    case "typescript":
      if (typescriptOut === undefined) {
        logMessage += "--typescript_out is a mandatory arguement when --output is typescript\n";
        error = true;
      }
      break;

    case "java":
      if (javaOut === undefined) {
        logMessage += "--java_out is a mandatory arguement when --output is java\n";
        error = true;
      }
      break;

    default:
      logMessage += "output language not supported yet";
      error = true;
  }

  return { error, logMessage };
}

export function validate(flags: TypedFlags<any>, jsonSchema: Schema) {
  const { error: flagError, logMessage: commandLogs } = validateCommand(flags);
  const { error: schemaError, logMessage: schemaLogs } = validateSchema(flags.output as string, jsonSchema);
  return {
    error: flagError || schemaError,
    logMessage: `${ commandLogs }\n${ schemaLogs }`
  };
}

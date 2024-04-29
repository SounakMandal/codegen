import { TypedFlags } from 'meow';
import { Schema, TypeDefinition } from '../interface/schema';
import { listDataTypeInSchema } from './constants';

function extractCustomTypesFromSchema(typeInformation: TypeDefinition[]) {
  let customTypes: string[] = [];
  for (let index = 0; index < typeInformation.length; index++) {
    customTypes = [...customTypes, typeInformation[index]["type"]];
  }
  return customTypes;
}

function validateType(customTypes: string[], typeValue: string) {
  if (customTypes.includes(typeValue)) return true;
  if (["string", "int", "float", "double"].includes(typeValue)) return true;
  if (!listDataTypeInSchema.test(typeValue)) return false;

  typeValue = typeValue.replace("[", " ");
  typeValue = typeValue.replace("]", " ");
  return validateType(customTypes, typeValue.split(" ")[1]);
}

function validateSchema(output: string, jsonSchema: Schema) {
  let error = false;
  let logMessage = "";
  const typeInformation = jsonSchema["types"];
  const compilerOptions = jsonSchema["compilerOptions"];

  switch (output) {
    case "java":
    case "golang":
      if (compilerOptions === undefined || compilerOptions[output] === undefined || compilerOptions[output]["package"] === undefined) {
        error = true;
        logMessage += `compilerOptions.${ output }.package is mandatory when --output is ${ output }`;
      }
      break;
  }

  const customTypes = extractCustomTypesFromSchema(typeInformation);
  for (let index = 0; index < typeInformation.length; index++) {
    const fields = typeInformation[index]["fields"];
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
  const { file, output, typescriptOut, javaOut, goOut } = flags as { [key: string]: string | boolean; };

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

    case "go":
      if (goOut === undefined) {
        logMessage += "--go_out is a mandatory arguement when --output is go\n";
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

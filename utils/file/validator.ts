import { TypedFlags } from 'meow';
import {
  Schema,
  SupportedLanguages,
  TypeDefinition,
} from '../../interface/schema';
import {
  getBaseTypeOfList,
  getCompilerOptionsFromSchema,
  getEntitiesFromSchema,
} from '../types/extractor';
import {
  isArrayType,
  isEnumType,
  isObjectType,
  isPrimitiveType,
} from '../types/matcher';

function validateCommand(flags: TypedFlags<any>) {
  let error = false;
  let logMessage = '';
  const { file, output, typescriptOut, javaOut, goOut } = flags as {
    [key: string]: string | boolean;
  };

  if (file === undefined) {
    logMessage += '--file is a mandatory arguement\n';
    error = true;
  }

  if (output === undefined) {
    logMessage += '--output is a mandatory arguement\n';
    error = true;
  }

  switch (output) {
    case 'typescript':
      if (typescriptOut === undefined) {
        logMessage +=
          '--typescript_out is a mandatory arguement when --output is typescript\n';
        error = true;
      }
      break;

    case 'java':
      if (javaOut === undefined) {
        logMessage +=
          '--java_out is a mandatory arguement when --output is java\n';
        error = true;
      }
      break;

    case 'go':
      if (goOut === undefined) {
        logMessage += '--go_out is a mandatory arguement when --output is go\n';
        error = true;
      }
      break;

    default:
      logMessage += 'output language not supported yet';
      error = true;
  }

  return { error, logMessage };
}

function extractCustomTypesFromSchema(entities: TypeDefinition[]) {
  let customTypes: string[] = [];
  for (let index = 0; index < entities.length; index++) {
    customTypes = [...customTypes, entities[index]['type']];
  }
  return customTypes;
}

function validateType(customTypes: string[], typeValue: string | object) {
  // Check if anonymous type
  if (isObjectType(typeValue)) return true;

  // Check if type is user defined in schema
  if (customTypes.includes(typeValue)) return true;

  // Check if primitive type
  if (isPrimitiveType(typeValue)) return true;

  // At this point only list type is supported
  if (!isArrayType(typeValue)) return false;
  return validateType(customTypes, getBaseTypeOfList(typeValue));
}

function validateSchema(output: SupportedLanguages, schema: Schema) {
  let error = false;
  let logMessage = '';
  const entities = getEntitiesFromSchema(schema);
  const compilerOptions = getCompilerOptionsFromSchema(schema);

  switch (output) {
    case 'java':
    case 'go':
      if (
        compilerOptions === undefined ||
        compilerOptions[output] === undefined ||
        compilerOptions[output]['package'] === undefined
      ) {
        error = true;
        logMessage += `compilerOptions.${ output }.package is mandatory when --output is ${ output }`;
      }
      break;
  }

  const customTypes = extractCustomTypesFromSchema(entities);
  for (let index = 0; index < entities.length; index++) {
    const fields = entities[index]['fields'];
    if (isEnumType(fields)) continue;
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

export function validate(flags: TypedFlags<any>, schema: Schema) {
  const { error: flagError, logMessage: commandLogs } = validateCommand(flags);
  const { error: schemaError, logMessage: schemaLogs } = validateSchema(
    flags.output as SupportedLanguages,
    schema,
  );
  return {
    error: flagError || schemaError,
    logMessage: `${ commandLogs }\n${ schemaLogs }`,
  };
}

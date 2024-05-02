import {
  Schema,
  SupportedLanguages,
  TypeDefinition,
} from '../../interface/schema';
import {
  getBaseTypeOfList,
  getCompilerOptionsFromSchema,
  getEntitiesFromSchema,
  getKeyTypeOfMap,
  getValueTypeOfMap,
} from './../types/extractor';
import {
  isArrayType,
  isEnumType,
  isMapType,
  isObjectType,
  isPrimitiveType,
} from './../types/matcher';

function extractCustomTypesFromSchema(entities: TypeDefinition[]) {
  let customTypes: string[] = [];
  for (let index = 0; index < entities.length; index++) {
    customTypes = [...customTypes, entities[index]['type']];
  }
  return customTypes;
}

function validateType(
  customTypes: string[],
  typeValue: string | object,
): boolean {
  if (isObjectType(typeValue)) return true;
  if (customTypes.includes(typeValue)) return true;
  if (isPrimitiveType(typeValue)) return true;
  if (isArrayType(typeValue))
    return validateType(customTypes, getBaseTypeOfList(typeValue));
  if (isMapType(typeValue))
    return (
      validateType(customTypes, getKeyTypeOfMap(typeValue)) &&
      validateType(customTypes, getValueTypeOfMap(typeValue))
    );
  return false;
}

export function validateSchema(output: SupportedLanguages, schema: Schema) {
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

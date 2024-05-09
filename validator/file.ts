import {
  Schema,
  SupportedLanguages,
  TypeDefinition,
} from '../interface/schema';
import {
  getBaseTypeOfList,
  getCompilerOptionsFromSchema,
  getEntitiesFromSchema,
  getKeyTypeOfMap,
  getValueTypeOfMap,
} from '../utils/schema/extractor';
import {
  isArrayType,
  isEnumType,
  isMapType,
  isObjectType,
  isPrimitiveType,
} from '../utils/schema/matcher';

function extractCustomTypesFromSchema(entities: TypeDefinition[]) {
  return entities.map(entity => entity["type"]);
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
  entities.forEach(entity => {
    const fields = entity['fields'];
    if (isEnumType(fields)) return;
    Object.values(fields).forEach(typeValue => {
      const typeValid = validateType(customTypes, typeValue);
      if (!typeValid) {
        error = true;
        logMessage += `Invalid datatype ${ typeValue } obtained\n`;
      }
    });
  });

  return { error, logMessage };
}

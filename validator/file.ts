import {
  Schema,
  SupportedLanguages,
  TypeDefinition,
} from '../interface/schema';
import { logger } from '../utils/logger';
import {
  getBaseTypeOfList,
  getCompilerOptionsFromSchema,
  getEndpointOptionsFromSchema,
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

export function validateSchema(output: SupportedLanguages, client: boolean, schema: Schema) {
  const entities = getEntitiesFromSchema(schema);
  const compilerOptions = getCompilerOptionsFromSchema(schema);

  switch (output) {
    case 'java':
    case 'go':
      if (!compilerOptions || !compilerOptions[output] || !compilerOptions[output]['package']) {
        logger.error(`compilerOptions.${ output }.package is mandatory when --output is ${ output }`);
        process.exit(1);
      }
      break;
    case 'typescript':
      if (!compilerOptions || !compilerOptions[output] || !compilerOptions[output]['type_module']) {
        logger.error(`compilerOptions.${ output }.type_module is mandatory when --output is ${ output }`);
        process.exit(1);
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
        logger.error(`Invalid datatype ${ typeValue } obtained`);
        process.exit(1);
      }
    });
  });

  if (!client) return;

  const endpointOptions = getEndpointOptionsFromSchema(schema);
  if (!endpointOptions) {
    logger.error(`endpoints is mandatory when --client is true`);
    process.exit(1);
  }

  switch (output) {
    case 'typescript':
      if (!compilerOptions || !compilerOptions[output] || !compilerOptions[output]['endpoints_module']) {
        logger.error(`compilerOptions.${ output }.endpoints_module is mandatory when --output is ${ output } and --client is true`);
        process.exit(1);
      }
      break;
  }
}

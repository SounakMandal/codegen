import { Schema, TypeDefinition } from '../../interface/schema';

export function getCompilerOptionsFromSchema(schema: Schema) {
  return schema['compilerOptions'];
}

export function getEndpointOptionsFromSchema(schema: Schema) {
  return schema['endpoints'];
}

export function getEntitiesFromSchema(schema: Schema) {
  return schema['types'];
}

export function getEntityName(entity: TypeDefinition) {
  return entity['type'];
}

export function getEntityFields(entity: TypeDefinition) {
  return entity['fields'];
}

export function getEntityDetails(entity: TypeDefinition) {
  return {
    entityName: getEntityName(entity),
    entityFields: getEntityFields(entity),
  };
}

export function getBaseTypeOfList(listType: string) {
  const splitCharacter = ':';
  listType = listType.replace('[', splitCharacter);
  listType = listType.replace(']', splitCharacter);
  return listType.split(splitCharacter)[1].trim();
}

function getKeyValuePair(mapType: string) {
  const splitCharacter = ':';
  mapType = mapType.replace('[', splitCharacter);
  mapType = mapType.replace(']', splitCharacter);
  return mapType.split(splitCharacter)[1];
}

export function getKeyTypeOfMap(mapType: string) {
  const splitCharacter = ':';
  let keyValuePair = getKeyValuePair(mapType);
  keyValuePair = keyValuePair.replace(',', splitCharacter);
  return keyValuePair.split(splitCharacter)[0].trim();
}

export function getValueTypeOfMap(mapType: string) {
  const splitCharacter = ':';
  let keyValuePair = getKeyValuePair(mapType);
  keyValuePair = keyValuePair.replace(',', splitCharacter);
  return keyValuePair.split(splitCharacter)[1].trim();
}

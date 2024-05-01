import { Schema, TypeDefinition } from '../../interface/schema';

export function getBaseTypeOfList(listType: string) {
  listType = listType.replace('[', ' ');
  listType = listType.replace(']', ' ');
  return listType.split(' ')[1];
}

export function getEnumValues(enumType: string) {
  const enumValues = enumType.split('|');
  return enumValues.map((value) => value.trim());
}

export function getCompilerOptionsFromSchema(schema: Schema) {
  return schema['compilerOptions'];
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

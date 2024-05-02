import { FieldDefinition, Schema } from '../../interface/schema';
import {
  getBaseTypeOfList,
  getEntitiesFromSchema,
  getEntityDetails,
  getKeyTypeOfMap,
  getValueTypeOfMap,
} from './extractor';
import {
  isArrayType,
  isEnumType,
  isMapType,
  isObjectType,
  isPrimitiveType,
} from './matcher';

function getTypeGraphOfEntity(entityFields: FieldDefinition) {
  let dependencyList: string[] = [];

  if (isEnumType(entityFields)) return dependencyList;
  for (const fieldName in entityFields) {
    const fieldType = entityFields[fieldName];
    if (isObjectType(fieldType) || isPrimitiveType(fieldType)) continue;
    if (isArrayType(fieldType)) {
      dependencyList = [...dependencyList, 'list'];
      const baseType = getBaseTypeOfList(fieldType);
      if (!isPrimitiveType(baseType))
        dependencyList = [...dependencyList, baseType];
      continue;
    }
    if (isMapType(fieldType)) {
      dependencyList = [...dependencyList, 'map'];
      const keyType = getKeyTypeOfMap(fieldType);
      if (!isPrimitiveType(keyType))
        dependencyList = [...dependencyList, keyType];
      const valueType = getValueTypeOfMap(fieldType);
      if (!isPrimitiveType(valueType))
        dependencyList = [...dependencyList, valueType];
      continue;
    }
    dependencyList = [...dependencyList, fieldType];
  }
  return [...new Set(dependencyList)];
}

export function getTypeGraphFromSchema(schema: Schema) {
  const entities = getEntitiesFromSchema(schema);
  let typeDependency = {};
  for (let index = 0; index < entities.length; index++) {
    const entity = entities[index];
    const { entityName, entityFields } = getEntityDetails(entity);
    typeDependency = {
      ...typeDependency,
      [entityName]: getTypeGraphOfEntity(entityFields),
    };
  }
  return typeDependency;
}

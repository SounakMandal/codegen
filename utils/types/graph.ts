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

  const handleAnonymousType = (fieldType: FieldDefinition) => {
    const nestedDependecyList = getTypeGraphOfEntity(fieldType);
    dependencyList = [...dependencyList, ...nestedDependecyList];
  };

  const handleArrayType = (fieldType: string) => {
    dependencyList = [...dependencyList, 'list'];
    const baseType = getBaseTypeOfList(fieldType);
    if (!isPrimitiveType(baseType))
      dependencyList = [...dependencyList, baseType];
  };

  const handleMapType = (fieldType: string) => {
    dependencyList = [...dependencyList, 'map'];
    const keyType = getKeyTypeOfMap(fieldType);
    if (!isPrimitiveType(keyType))
      dependencyList = [...dependencyList, keyType];
    const valueType = getValueTypeOfMap(fieldType);
    if (!isPrimitiveType(valueType))
      dependencyList = [...dependencyList, valueType];
  };

  if (isEnumType(entityFields)) return dependencyList;
  Object.values(entityFields)
    .forEach((fieldType, _) => {
      if (isObjectType(fieldType)) handleAnonymousType(fieldType);
      else if (isArrayType(fieldType)) handleArrayType(fieldType);
      else if (isMapType(fieldType)) handleMapType(fieldType);
      else if (isPrimitiveType(fieldType)) return;
      else dependencyList = [...dependencyList, fieldType];
    });
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

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
    const nestedDependencyList = getTypeGraphOfEntity(fieldType);
    dependencyList.push(...nestedDependencyList);
  };

  const handleArrayType = (fieldType: string) => {
    dependencyList.push('list');
    const baseType = getBaseTypeOfList(fieldType);
    if (!isPrimitiveType(baseType)) dependencyList.push(baseType);
  };

  const handleMapType = (fieldType: string) => {
    dependencyList.push('map');
    const keyType = getKeyTypeOfMap(fieldType);
    if (!isPrimitiveType(keyType)) dependencyList.push(keyType);
    const valueType = getValueTypeOfMap(fieldType);
    if (!isPrimitiveType(valueType)) dependencyList.push(valueType);
  };

  if (isEnumType(entityFields)) return dependencyList;
  Object.values(entityFields)
    .forEach((fieldType, _) => {
      if (isObjectType(fieldType)) handleAnonymousType(fieldType);
      else if (isArrayType(fieldType)) handleArrayType(fieldType);
      else if (isMapType(fieldType)) handleMapType(fieldType);
      else if (isPrimitiveType(fieldType)) return;
      else dependencyList.push(fieldType);
    });
  return [...new Set(dependencyList)];
}

export function getTypeGraphFromSchema(schema: Schema) {
  const entities = getEntitiesFromSchema(schema);
  return entities.reduce((typeDependency, entity) => {
    const { entityName, entityFields } = getEntityDetails(entity);
    return {
      ...typeDependency,
      [entityName]: getTypeGraphOfEntity(entityFields),
    };
  }, {});
}

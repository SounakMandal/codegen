import { FieldDefinition, Schema } from '../../interface/schema';
import {
  getBaseTypeOfList,
  getEntitiesFromSchema,
  getEntityDetails,
} from './extractor';
import {
  isArrayType,
  isEnumType,
  isObjectType,
  isPrimitiveType,
} from './matcher';

function getTypeGraphOfEntity(entityFields: FieldDefinition) {
  let dependencyList: string[] = [];

  if (isEnumType(entityFields)) return dependencyList;
  for (const fieldName in entityFields) {
    const fieldType = entityFields[fieldName];
    if (isObjectType(fieldType)) {
      continue;
    } else if (!isPrimitiveType(fieldType)) {
      if (!isArrayType(fieldType)) {
        dependencyList = [...dependencyList, fieldType];
        continue;
      }

      dependencyList = [...dependencyList, 'list'];
      const baseType = getBaseTypeOfList(fieldType);
      if (!isPrimitiveType(baseType))
        dependencyList = [...dependencyList, baseType];
    }
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

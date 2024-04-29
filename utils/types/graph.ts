import { FieldDefinition, Schema } from '../../interface/schema';
import { listDataTypeInSchema } from './constants';
import {
  getBaseTypeOfList,
  getEntitiesFromSchema,
  getEntityDetails,
} from './extractor';

function isPrimitiveType(fieldType: string) {
  switch (fieldType) {
    case 'int':
    case 'float':
    case 'double':
    case 'string':
      return true;

    default:
      return false;
  }
}

function getTypeGraphOfEntity(entityFields: FieldDefinition) {
  let dependencyList: string[] = [];

  for (const fieldName in entityFields) {
    const fieldType = entityFields[fieldName];
    if (typeof fieldType === 'object' && fieldType !== null) {
      continue;
    } else if (!isPrimitiveType(fieldType)) {
      if (!listDataTypeInSchema.test(fieldType)) continue;
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

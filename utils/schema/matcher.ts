import { FieldDefinition } from '../../interface/schema';
import { listDataTypeInSchema, mapDataTypeInSchema } from './constants';

export function isPrimitiveType(fieldType: string) {
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

export function isObjectType(typeValue: string | object): typeValue is object {
  return typeof typeValue === 'object' && typeValue !== null;
}

export function isEnumType(fields: FieldDefinition): fields is string[] {
  return Array.isArray(fields);
}

export function isArrayType(fieldType: string) {
  return listDataTypeInSchema.test(fieldType);
}

export function isMapType(fieldType: string) {
  return mapDataTypeInSchema.test(fieldType);
}

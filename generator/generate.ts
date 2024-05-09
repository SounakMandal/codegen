import {
  TypeMapper,
  FieldConverter,
  TemplateBuilder,
  FileFormatter,
  TemplateOptions,
} from '../interface/mapper';
import { FieldDefinition, TypeDefinition } from '../interface/schema';
import { appendFileWithLog, writeFileWithLog } from '../utils/file/file';
import { getEntityFields, getEntityName } from '../utils/schema/extractor';
import { isObjectType, isEnumType } from '../utils/schema/matcher';
import { convertToTitleCase } from '../utils/file/naming';

function generateEntityFieldFromType(
  fieldName: string,
  schemaFieldType: string | FieldDefinition,
  typeMapper: TypeMapper,
  fieldConverter: FieldConverter,
) {
  let fieldType: string;
  let anonymousEntity: TypeDefinition | null = null;
  if (isObjectType(schemaFieldType)) {
    fieldType = convertToTitleCase(fieldName);
    anonymousEntity = {
      type: fieldType,
      fields: schemaFieldType,
    };
  } else fieldType = typeMapper(schemaFieldType);
  return {
    entityField: fieldConverter(fieldType, fieldName),
    anonymousEntity,
  };
}

function generateEntityFieldFromEnumType(
  schemaFieldType: string,
  typeMapper: TypeMapper,
  fieldConverter: FieldConverter,
) {
  const fieldType = typeMapper(schemaFieldType);
  return fieldConverter(fieldType, null);
}

export function generateEntityFromType(
  entity: TypeDefinition,
  typeMapper: TypeMapper,
  fieldConverter: FieldConverter,
) {
  let enumType = false;
  let fieldInformation = '';
  let anonymousEntities: TypeDefinition[] = [];
  const entityFields = getEntityFields(entity);
  if (isEnumType(entityFields)) {
    enumType = true;
    entityFields.forEach(entityField => {
      fieldInformation += generateEntityFieldFromEnumType(
        entityField,
        typeMapper,
        fieldConverter,
      );
    });
  } else {
    Object.entries(entityFields).forEach(([fieldName, fieldValue]) => {
      const { entityField, anonymousEntity } = generateEntityFieldFromType(
        fieldName,
        fieldValue,
        typeMapper,
        fieldConverter,
      );
      fieldInformation += entityField;
      if (anonymousEntity != null) {
        anonymousEntities.push(anonymousEntity);
      }
    });
  }
  return { fieldInformation, anonymousEntities, enumType };
}

export function processAnonymousEntities(
  file: string,
  anonymousEntities: TypeDefinition[],
  typeMapper: TypeMapper,
  fieldConverter: FieldConverter,
  templateBuilder: TemplateBuilder,
) {
  anonymousEntities.forEach((anonymousEntity, index) => {
    const entityName = getEntityName(anonymousEntity);
    const {
      fieldInformation,
      anonymousEntities: nestedAnonymousEntities,
      enumType,
    } = generateEntityFromType(anonymousEntity, typeMapper, fieldConverter);
    const entityDefinition = templateBuilder(entityName, fieldInformation, {
      includePackage: false,
      enumType,
    });
    const syncCondition = nestedAnonymousEntities.length > 0 && index !== anonymousEntities.length;
    appendFileWithLog(file, `\n${ entityDefinition }`, syncCondition);
    processAnonymousEntities(
      file,
      nestedAnonymousEntities,
      typeMapper,
      fieldConverter,
      templateBuilder,
    );
  });
}

export function writeEntityToFile(
  file: string,
  entity: TypeDefinition,
  typeMapper: TypeMapper,
  fieldConverter: FieldConverter,
  templateBuilder: TemplateBuilder,
  format: FileFormatter,
  options: TemplateOptions,
) {
  const { packageName, typeGraph } = options;
  const entityName = getEntityName(entity);
  const { fieldInformation, anonymousEntities, enumType } =
    generateEntityFromType(entity, typeMapper, fieldConverter);
  const entityDefinition = templateBuilder(entityName, fieldInformation, {
    packageName,
    includePackage: true,
    typeGraph,
    enumType,
  });
  writeFileWithLog(file, entityDefinition, anonymousEntities.length > 0);
  processAnonymousEntities(
    file,
    anonymousEntities,
    typeMapper,
    fieldConverter,
    templateBuilder,
  );
  format(file);
  return `File ${ file } written successfully with entity ${ entityName }`;
}

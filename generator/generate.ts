import {
  TypeMapper,
  FieldConverter,
  TemplateBuilder,
  FileFormatter,
  TemplateOptions,
} from '../interface/mapper';
import { FieldDefinition, TypeDefinition } from '../interface/schema';
import { appendFileWithLog, writeFileWithLog } from '../utils/file/file';
import { getEntityFields, getEntityName } from '../utils/types/extractor';
import { isObjectType, isEnumType } from '../utils/types/matcher';
import { convertToTitleCase } from '../utils/file/naming';

function generateEntityFieldFromType(
  fieldName: string,
  rawFieldType: string | FieldDefinition,
  typeMapper: TypeMapper,
  fieldConverter: FieldConverter,
) {
  let fieldType: string;
  let anonymousEntity: TypeDefinition | null = null;
  if (isObjectType(rawFieldType)) {
    fieldType = convertToTitleCase(fieldName);
    anonymousEntity = {
      type: fieldType,
      fields: rawFieldType,
    };
  } else fieldType = typeMapper(rawFieldType);
  return {
    entityField: fieldConverter(fieldType, fieldName),
    anonymousEntity,
  };
}

function generateEntityFieldFromEnumType(
  rawFieldType: string,
  typeMapper: TypeMapper,
  fieldConverter: FieldConverter,
) {
  const fieldType = typeMapper(rawFieldType);
  return fieldConverter(fieldType, null);
}

export function generateEntityFromType(
  entity: TypeDefinition,
  typeMapper: TypeMapper,
  fieldConverter: FieldConverter,
) {
  let fieldInformation = '';
  let enumType: boolean = false;
  let anonymousEntities: TypeDefinition[] = [];
  const entityFields = getEntityFields(entity);
  if (isEnumType(entityFields)) {
    enumType = true;
    for (let index = 0; index < entityFields.length; index++) {
      const entityField = generateEntityFieldFromEnumType(
        entityFields[index],
        typeMapper,
        fieldConverter,
      );
      fieldInformation += entityField;
    }
  } else {
    for (const fieldName in entityFields) {
      const { entityField, anonymousEntity } = generateEntityFieldFromType(
        fieldName,
        entityFields[fieldName],
        typeMapper,
        fieldConverter,
      );
      fieldInformation += entityField;
      if (anonymousEntity != null)
        anonymousEntities = [...anonymousEntities, anonymousEntity];
    }
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
  for (let index = 0; index < anonymousEntities.length; index++) {
    const anonymousEntity = anonymousEntities[index];
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
    const syncCondition =
      nestedAnonymousEntities.length > 0 && index !== anonymousEntities.length;
    appendFileWithLog(file, `\n${ entityDefinition }`, syncCondition);
    processAnonymousEntities(
      file,
      nestedAnonymousEntities,
      typeMapper,
      fieldConverter,
      templateBuilder,
    );
  }
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
  console.log(
    `File ${ file } written successfully with schema entity ${ entityName }`,
  );
}

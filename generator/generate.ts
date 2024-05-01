import { characterAfterHyphenOrUnderscore } from '../utils/types/constants';
import { FieldDefinition, TypeDefinition } from '../interface/schema';
import { appendFileWithLog, writeFileWithLog } from '../utils/file/file';
import {
  TypeMapper,
  FieldConverter,
  TemplateBuilder,
  TemplateOptions,
  FileFormatter,
} from './../interface/mapper';
import { getEntityFields, getEntityName } from '../utils/types/extractor';

export function convertToCamelCase(str: string) {
  return str.replace(characterAfterHyphenOrUnderscore, (_, char) =>
    char.toUpperCase(),
  );
}

export function convertToTitleCase(str: string) {
  const camelCasedString = convertToCamelCase(str);
  return camelCasedString.charAt(0).toUpperCase() + camelCasedString.slice(1);
}

export function fileNameGenerator(
  outputDirectoryPath: string,
  fileName: string,
  fileType: string,
) {
  return `${ outputDirectoryPath }/${ fileName }.${ fileType }`;
}

function generateEntityFieldFromType(
  fieldName: string,
  rawFieldType: FieldDefinition[string],
  typeMapper: TypeMapper,
  fieldConverter: FieldConverter,
) {
  let fieldType: string;
  let anonymousEntity: TypeDefinition | null = null;
  if (typeof rawFieldType === 'object') {
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

function generateEntityFromType(
  entity: TypeDefinition,
  typeMapper: TypeMapper,
  fieldConverter: FieldConverter,
) {
  let fieldInformation = '';
  let anonymousEntities: TypeDefinition[] = [];
  const entityFields = getEntityFields(entity);
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
  return { fieldInformation, anonymousEntities };
}

function processAnonymousEntities(
  file: string,
  anonymousEntities: TypeDefinition[],
  typeMapper: TypeMapper,
  fieldConverter: FieldConverter,
  templateBuilder: TemplateBuilder,
) {
  for (let index = 0; index < anonymousEntities.length; index++) {
    const anonymousEntity = anonymousEntities[index];
    const entityName = getEntityName(anonymousEntity);
    const { fieldInformation, anonymousEntities: nestedAnonymousEntities } =
      generateEntityFromType(anonymousEntity, typeMapper, fieldConverter);
    const entityDefinition = templateBuilder(entityName, fieldInformation, {
      includePackage: false,
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
  const { fieldInformation, anonymousEntities } = generateEntityFromType(
    entity,
    typeMapper,
    fieldConverter,
  );
  const entityDefinition = templateBuilder(entityName, fieldInformation, {
    packageName,
    includePackage: true,
    typeGraph,
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

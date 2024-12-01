import { readFileSync } from 'fs';
import { compile } from 'handlebars';
import { logger } from '../utils/logger';
import { convertToCamelCase, convertToTitleCase } from '../utils/file/naming';
import { EndpointTypes, TypeDefinition } from '../interface/schema';
import { appendFileWithLog, deleteFile } from '../utils/file/file';

function generateCrudEndpoints(outputDirectoryPath: string, entity: TypeDefinition) {
  const entityName = entity.type;
  const templates = {
    create: `create.hbs`,
    read: `read.hbs`,
    update: `update.hbs`,
    delete: `delete.hbs`,
  };
  const outputFilePath = `${ outputDirectoryPath }/${ convertToCamelCase(entityName) }.ts`;
  deleteFile(outputFilePath);

  let endpointName = convertToCamelCase(entityName);
  if (!endpointName.endsWith('s')) endpointName += 's';

  let shouldImport = true;
  const entityReference = convertToTitleCase(entityName);
  const imports = `import { type ${ entityReference }} from '../models';`;

  for (const [operation, templateFileName] of Object.entries(templates)) {
    const templatePath = `./template/typescript/${ templateFileName }`;
    const templateContent = readFileSync(templatePath, 'utf-8');
    const compiledTemplate = compile(templateContent, { noEscape: true });
    const result = compiledTemplate({
      imports: shouldImport ? imports : null,
      entityName: entityReference,
      endpointName
    });

    shouldImport = false;
    appendFileWithLog(outputFilePath, result, true);
    logger.info(`File ${ outputFilePath } updated with ${ operation.toUpperCase() } /${ endpointName }`);
  }
}

function generateSearchEndpoints(outputDirectoryPath: string, entity: TypeDefinition) {

}

export function generateEndpoints(outputDirectoryPath: string, entities: TypeDefinition[], endpoint: EndpointTypes) {
  const endpointMapper = {
    crud: generateCrudEndpoints,
    search: generateSearchEndpoints
  };
  entities.forEach(entity => endpointMapper[endpoint](outputDirectoryPath, entity));
}

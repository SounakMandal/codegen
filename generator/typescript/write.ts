import { TemplateOptions } from '../../interface/mapper';
import { Endpoints, TypeDefinition } from '../../interface/schema';
import { createDirectory, writeFileWithLog } from '../../utils/file/file';
import { getEntityName } from '../../utils/schema/extractor';
import { fileNameGenerator } from '../../utils/file/naming';
import {
  convertToTypescriptEntityField,
  typescriptTemplateBuilder,
  typescriptDatatypeMapper,
  typescriptFormatter,
} from './mapper';
import { writeEntityToFile } from '../entity';
import { generateEndpoints } from '../endpoints';

export function typescriptEntityGenerator(
  outputDirectoryPath: string,
  entities: TypeDefinition[],
  options: TemplateOptions,
) {
  let indexFileContents = '';
  const fullDirectoryPath = `${ outputDirectoryPath }/${ options.type_module }`;
  createDirectory(fullDirectoryPath);

  entities.forEach(entity => {
    const fileName = getEntityName(entity).toLowerCase();
    const file = fileNameGenerator(fullDirectoryPath, fileName, 'ts');
    writeEntityToFile(
      file,
      entity,
      typescriptDatatypeMapper,
      convertToTypescriptEntityField,
      typescriptTemplateBuilder,
      typescriptFormatter,
      options,
    );
    indexFileContents += `export * from './${ fileName }';\n`;
  });

  const indexFile = fileNameGenerator(fullDirectoryPath, 'index', 'ts');
  writeFileWithLog(indexFile, indexFileContents, true);
}

export function typescriptClientGenerator(
  outputDirectoryPath: string,
  entities: TypeDefinition[],
  endpoints: Endpoints,
  options: TemplateOptions
) {
  const fullDirectoryPath = `${ outputDirectoryPath }/${ options.endpoints_module }`;
  createDirectory(fullDirectoryPath);
  if (Array.isArray(endpoints)) {
    endpoints.forEach(endpoint => generateEndpoints(fullDirectoryPath, entities, endpoint));
  } else {

  }
};

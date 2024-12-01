import { TemplateOptions } from '../../interface/mapper';
import { TypeDefinition } from '../../interface/schema';
import { createDirectory } from '../../utils/file/file';
import { getEntityName } from '../../utils/schema/extractor';
import { fileNameGenerator } from '../../utils/file/naming';
import {
  convertToGolangEntityField,
  golangTemplateBuilder,
  golangDatatypeMapper,
  golangFormatter,
} from './mapper';
import { writeEntityToFile } from '../entity';

export function goEntityGenerator(
  outputDirectoryPath: string,
  entities: TypeDefinition[],
  options: TemplateOptions,
) {
  const fullDirectoryPath = `${ outputDirectoryPath }/${ options.package }`;
  createDirectory(fullDirectoryPath);
  entities.forEach(entity => {
    const fileName = getEntityName(entity).toLowerCase();
    const file = fileNameGenerator(fullDirectoryPath, fileName, 'go');
    writeEntityToFile(
      file,
      entity,
      golangDatatypeMapper,
      convertToGolangEntityField,
      golangTemplateBuilder,
      golangFormatter,
      { packageName: options.package },
    );
  });
}

import { TemplateOptions } from '../../interface/mapper';
import { TypeDefinition } from '../../interface/schema';
import { createDirectory } from '../../utils/file/file';
import { getEntityName } from '../../utils/types/extractor';
import { fileNameGenerator, writeEntityToFile } from '../generate';
import {
  convertToGolangEntityField,
  golangTemplateBuilder,
  golangDatatypeMapper,
  golangFormatter,
} from './mapper';

export default function generateType(
  outputDirectoryPath: string,
  entities: TypeDefinition[],
  options: TemplateOptions,
) {
  createDirectory(outputDirectoryPath);

  for (let index = 0; index < entities.length; index++) {
    const entity = entities[index];
    const fileName = getEntityName(entity).toLowerCase();
    const file = fileNameGenerator(outputDirectoryPath, fileName, 'go');
    writeEntityToFile(
      file,
      entity,
      golangDatatypeMapper,
      convertToGolangEntityField,
      golangTemplateBuilder,
      golangFormatter,
      { packageName: options.package },
    );
  }
}

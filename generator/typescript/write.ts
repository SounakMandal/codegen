import { TemplateOptions } from '../../interface/mapper';
import { TypeDefinition } from '../../interface/schema';
import { createDirectory } from '../../utils/file/file';
import { getEntityName } from '../../utils/types/extractor';
import { fileNameGenerator } from '../../utils/file/naming';
import {
  convertToTypescriptEntityField,
  typescriptTemplateBuilder,
  typescriptDatatypeMapper,
  typescriptFormatter,
} from './mapper';
import { writeEntityToFile } from '../generate';

export default function generateType(
  outputDirectoryPath: string,
  entities: TypeDefinition[],
  options: TemplateOptions,
) {
  createDirectory(outputDirectoryPath);

  for (let index = 0; index < entities.length; index++) {
    const entity = entities[index];
    const fileName = getEntityName(entity).toLowerCase();
    const file = fileNameGenerator(outputDirectoryPath, fileName, 'ts');
    writeEntityToFile(
      file,
      entity,
      typescriptDatatypeMapper,
      convertToTypescriptEntityField,
      typescriptTemplateBuilder,
      typescriptFormatter,
      options,
    );
  }
}

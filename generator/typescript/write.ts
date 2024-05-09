import { TemplateOptions } from '../../interface/mapper';
import { TypeDefinition } from '../../interface/schema';
import { createDirectory } from '../../utils/file/file';
import { getEntityName } from '../../utils/schema/extractor';
import { fileNameGenerator } from '../../utils/file/naming';
import {
  convertToTypescriptEntityField,
  typescriptTemplateBuilder,
  typescriptDatatypeMapper,
  typescriptFormatter,
} from './mapper';
import { writeEntityToFile } from '../generate';

export default function generateTypeDefinition(
  outputDirectoryPath: string,
  entities: TypeDefinition[],
  options: TemplateOptions,
) {
  const logs = [];
  const log = createDirectory(outputDirectoryPath);
  logs.push(log);
  entities.forEach(entity => {
    const fileName = getEntityName(entity).toLowerCase();
    const file = fileNameGenerator(outputDirectoryPath, fileName, 'ts');
    const log = writeEntityToFile(
      file,
      entity,
      typescriptDatatypeMapper,
      convertToTypescriptEntityField,
      typescriptTemplateBuilder,
      typescriptFormatter,
      options,
    );
    logs.push(log);
  });
  return logs;
}

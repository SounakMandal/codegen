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
    const file = fileNameGenerator(outputDirectoryPath, fileName, 'go');
    const log = writeEntityToFile(
      file,
      entity,
      golangDatatypeMapper,
      convertToGolangEntityField,
      golangTemplateBuilder,
      golangFormatter,
      { packageName: options.package },
    );
    logs.push(log);
  });
  return logs;
}

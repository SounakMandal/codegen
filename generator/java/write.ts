import { TemplateOptions } from '../../interface/mapper';
import { TypeDefinition } from '../../interface/schema';
import { createDirectory } from '../../utils/file/file';
import { getEntityName } from '../../utils/schema/extractor';
import { convertToTitleCase, fileNameGenerator } from '../../utils/file/naming';
import {
  convertToJavaEntityField,
  javaTemplateBuilder,
  javaDatatypeMapper,
  javaFormatter,
} from './mapper';
import { writeEntityToFile } from '../generate';

export default function generateTypeDefinition(
  outputDirectoryPath: string,
  entities: TypeDefinition[],
  options: TemplateOptions,
) {
  const { package: javaPackage } = options;
  const directories = javaPackage.split('.');
  const slashDelimitedDirectoryPath = `${ outputDirectoryPath }/${ directories.join('/') }`;

  const logs = [];
  const log = createDirectory(slashDelimitedDirectoryPath);
  logs.push(log);

  entities.forEach(entity => {
    const fileName = convertToTitleCase(getEntityName(entity));
    const file = fileNameGenerator(
      slashDelimitedDirectoryPath,
      fileName,
      'java',
    );
    const log = writeEntityToFile(
      file,
      entity,
      javaDatatypeMapper,
      convertToJavaEntityField,
      javaTemplateBuilder,
      javaFormatter,
      { packageName: javaPackage, ...options },
    );
    logs.push(log);
  });
  return logs;
}

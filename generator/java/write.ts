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
import { writeEntityToFile } from '../entity';

export function javaEntityGenerator(
  outputDirectoryPath: string,
  entities: TypeDefinition[],
  options: TemplateOptions,
) {
  const { package: javaPackage } = options;
  const directories = javaPackage.split('.');
  const fullDirectoryPath = `${ outputDirectoryPath }/${ directories.join('/') }`;

  createDirectory(fullDirectoryPath);
  entities.forEach(entity => {
    const fileName = convertToTitleCase(getEntityName(entity));
    const file = fileNameGenerator(
      fullDirectoryPath,
      fileName,
      'java',
    );
    writeEntityToFile(
      file,
      entity,
      javaDatatypeMapper,
      convertToJavaEntityField,
      javaTemplateBuilder,
      javaFormatter,
      { packageName: javaPackage, ...options },
    );
  });
}

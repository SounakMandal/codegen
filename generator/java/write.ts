import { TemplateOptions } from '../../interface/mapper';
import { TypeDefinition } from '../../interface/schema';
import { createDirectory } from '../../utils/file/file';
import { getEntityName } from '../../utils/types/extractor';
import { convertToTitleCase, fileNameGenerator } from '../../utils/file/naming';
import {
  convertToJavaEntityField,
  javaTemplateBuilder,
  javaDatatypeMapper,
  javaFormatter,
} from './mapper';
import { writeEntityToFile } from '../generate';

export default function generateType(
  outputDirectoryPath: string,
  entities: TypeDefinition[],
  options: TemplateOptions,
) {
  const { package: javaPackage } = options;
  const directories = javaPackage.split('.');
  const slashDelimitedDirectoryPath = `${ outputDirectoryPath }/${ directories.join('/') }`;
  createDirectory(slashDelimitedDirectoryPath);

  entities.forEach(entity => {
    const fileName = convertToTitleCase(getEntityName(entity));
    const file = fileNameGenerator(
      slashDelimitedDirectoryPath,
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

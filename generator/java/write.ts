import { TypeDefinition } from '../../interface/schema';
import { convertToTitleCase, createDirectory, writeFileWithLog } from '../create';
import { javaParser } from './generator';

export default function generateType(outputDirectoryPath: string, javaPackage: string, data: TypeDefinition[]) {
  const directories = javaPackage.split(".");
  const slashDelimitedDirectoryPath = `${ outputDirectoryPath }/${ directories.join("/") }`;
  createDirectory(slashDelimitedDirectoryPath);

  for (let index = 0; index < data.length; index++) {
    const dto = data[index];
    const file = `${ slashDelimitedDirectoryPath }/${ convertToTitleCase(dto["type"]) }.java`;
    const generatedType = javaParser(javaPackage, dto);
    writeFileWithLog(file, generatedType);
  }
}

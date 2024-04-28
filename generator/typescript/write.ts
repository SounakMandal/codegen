import { TypeDefinition } from '../../interface/schema';
import { createDirectory, writeFileWithLog } from '../create';
import { typescriptParser } from './generator';

export default function generateType(outputDirectoryPath: string, data: TypeDefinition[]) {
  createDirectory(outputDirectoryPath);

  for (let index = 0; index < data.length; index++) {
    const dto = data[index];
    const file = `${ outputDirectoryPath }/${ dto["type"].toLowerCase() }.ts`;
    const generatedType = typescriptParser(dto);
    writeFileWithLog(file, generatedType);
  }
}

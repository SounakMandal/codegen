import { TypeDefinition } from '../../interface/schema';
import { createDirectory, fileNameGenerator, writeFileWithLog } from '../create';
import { typescriptParser } from './generator';

export default function generateType(outputDirectoryPath: string, data: TypeDefinition[]) {
  createDirectory(outputDirectoryPath);

  for (let index = 0; index < data.length; index++) {
    const typeInformation = data[index];
    const file = fileNameGenerator(outputDirectoryPath, typeInformation["type"].toLowerCase(), "ts");
    const generatedType = typescriptParser(typeInformation);
    writeFileWithLog(file, generatedType);
  }
}

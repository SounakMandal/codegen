import { TypeDefinition } from '../../interface/schema';
import { createDirectory, fileNameGenerator, writeFileWithLog } from '../create';
import { golangParser } from './generator';

export default function generateType(outputDirectoryPath: string, goPackage: string, data: TypeDefinition[]) {
  createDirectory(outputDirectoryPath);

  for (let index = 0; index < data.length; index++) {
    const typeInformation = data[index];
    const file = fileNameGenerator(outputDirectoryPath, typeInformation["type"].toLowerCase(), "go");
    const generatedType = golangParser(goPackage, typeInformation);
    writeFileWithLog(file, generatedType);
  }
}

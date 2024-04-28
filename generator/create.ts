import { mkdirSync, writeFile } from 'fs';
import { characterAfterHyphenOrUnderscore } from '../utils/constants';

export function createDirectory(outputDirectoryPath: string) {
  console.log(`Creating directory ${ outputDirectoryPath }`);
  mkdirSync(outputDirectoryPath, { recursive: true });
}

export function writeFileWithLog(file: string, generatedType: string) {
  writeFile(file, generatedType, 'utf8', (err) => {
    if (err) {
      console.log(err);
      throw new Error('Error writing file:' + file);
    }
    console.log(`File ${ file } written successfully`);
  });
}

export function convertToCamelCase(str: string) {
  return str.replace(characterAfterHyphenOrUnderscore, (_, char) => char.toUpperCase());
}

export function convertToTitleCase(str: string) {
  const camelCasedString = convertToCamelCase(str);
  return camelCasedString.charAt(0).toUpperCase() + camelCasedString.slice(1);
}

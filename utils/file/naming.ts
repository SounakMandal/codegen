import { characterAfterHyphenOrUnderscore } from '../types/constants';

export function convertToCamelCase(str: string) {
  return str.replace(characterAfterHyphenOrUnderscore, (_, char) =>
    char.toUpperCase(),
  );
}

export function convertToTitleCase(str: string) {
  const camelCasedString = convertToCamelCase(str);
  return camelCasedString.charAt(0).toUpperCase() + camelCasedString.slice(1);
}

export function fileNameGenerator(
  outputDirectoryPath: string,
  fileName: string,
  fileType: string,
) {
  return `${outputDirectoryPath}/${fileName}.${fileType}`;
}

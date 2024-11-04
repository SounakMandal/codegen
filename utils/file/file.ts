import {
  appendFile,
  appendFileSync,
  mkdirSync,
  writeFile,
  writeFileSync,
} from 'fs';

export function createDirectory(outputDirectoryPath: string) {
  mkdirSync(outputDirectoryPath, { recursive: true });
  return `Creating directory ${ outputDirectoryPath }`;
}

export function writeFileWithLog(
  file: string,
  entityDefinition: string,
  sync: boolean,
) {
  if (sync) {
    writeFileSync(file, entityDefinition, 'utf8');
  } else {
    writeFile(file, entityDefinition, 'utf8', (err: any) => {
      if (err) {
        console.log(err);
        throw new Error('Error writing file:' + file);
      }
    });
  }
}

export function appendFileWithLog(
  file: string,
  entityDefinition: string,
  sync: boolean,
) {
  if (sync) {
    appendFileSync(file, entityDefinition, 'utf8');
  } else {
    appendFile(file, entityDefinition, 'utf8', (err: any) => {
      if (err) {
        console.log(err);
        throw new Error('Error writing file:' + file);
      }
    });
  }
}

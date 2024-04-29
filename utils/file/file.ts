import {
  appendFile,
  appendFileSync,
  mkdirSync,
  writeFile,
  writeFileSync,
} from 'fs';

export function createDirectory(outputDirectoryPath: string) {
  console.log(`Creating directory ${ outputDirectoryPath }`);
  mkdirSync(outputDirectoryPath, { recursive: true });
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

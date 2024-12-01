import {
  appendFile,
  appendFileSync,
  mkdirSync,
  unlinkSync,
  writeFile,
  writeFileSync,
} from 'fs';
import { logger } from '../logger';

export function createDirectory(outputDirectoryPath: string) {
  mkdirSync(outputDirectoryPath, { recursive: true });
  logger.info(`Creating directory ${ outputDirectoryPath }`);
}

export function writeFileWithLog(
  file: string,
  contents: string,
  sync: boolean,
) {
  if (sync) {
    writeFileSync(file, contents, 'utf8');
  } else {
    writeFile(file, contents, 'utf8', (err: any) => {
      if (err) {
        logger.error(err);
        throw new Error('Error writing file:' + file);
      }
    });
  }
}

export function appendFileWithLog(
  file: string,
  contents: string,
  sync: boolean,
) {
  if (sync) {
    appendFileSync(file, contents, 'utf8');
  } else {
    appendFile(file, contents, 'utf8', (err: any) => {
      if (err) {
        logger.error(err);
        throw new Error('Error writing file:' + file);
      }
    });
  }
}

export function deleteFile(file: string) {
  try {
    unlinkSync(file);
  } catch (err) {
    logger.error(`Error deleting file at ${ file }:`, err);
  }
}

#!/usr/bin/env node

/**
 * codegen
 * A CLI tool for generating REST DTOs
 *
 * @author Sounak Mandal <sounak>
 */

import { readFile } from 'fs';
import init from './utils/init';
import cli from './utils/cli';
import log from './utils/log';
import { validate } from './utils/validator';
import typescriptGenerator from './generator/typescript/write';
import javaGenerator from './generator/java/write';
import { Schema } from './interface/schema';

const input = cli.input;
const flags = cli.flags;
const { clear, debug, file, output, typescriptOut, javaOut } = flags as { [key: string]: string | boolean; };

function validateAndGenerateOutput(jsonSchema: Schema) {
  const { error, logMessage } = validate(flags, jsonSchema);
  if (error) {
    log(logMessage);
    return;
  }

  const dtoInformation = jsonSchema["dto"];
  const compilerOptions = jsonSchema["compilerOptions"];
  switch (output) {
    case "typescript":
      typescriptGenerator(
        typescriptOut as string,
        dtoInformation
      );
      break;

    case "java":
      javaGenerator(
        javaOut as string,
        compilerOptions.java.package,
        dtoInformation
      );
      break;

    default:
      break;
  }
}

(async () => {
  init({ clear: !!clear });

  if (input.includes(`help`)) {
    cli.showHelp(0);
    return;
  }

  if (debug) {
    log(flags);
    return;
  }

  readFile(file as string, 'utf8', (err: any, data: string) => {
    if (err) throw new Error('Error reading file:' + file);
    const jsonSchema = JSON.parse(data);
    validateAndGenerateOutput(jsonSchema);
  });
})();

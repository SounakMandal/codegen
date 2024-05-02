#!/usr/bin/env node

/**
 * codegen
 * A CLI tool for generating REST DTOs
 *
 * @author Sounak Mandal <sounak>
 */

import { readFile } from 'fs';
import init from './utils/cmd/init';
import cli from './utils/cmd/cli';
import log from './utils/cmd/log';
import { validate } from './utils/validator';
import typescriptGenerator from './generator/typescript/write';
import javaGenerator from './generator/java/write';
import goGenerator from './generator/go/write';
import { Schema } from './interface/schema';
import {
  getCompilerOptionsFromSchema,
  getEntitiesFromSchema,
} from './utils/types/extractor';
import { getTypeGraphFromSchema } from './utils/types/graph';

const input = cli.input;
const flags = cli.flags;
const { clear, debug, file, output, typescriptOut, javaOut, goOut } = flags as {
  [key: string]: string | boolean;
};

function validateAndGenerateOutput(schema: Schema) {
  const { error, logMessage } = validate(flags, schema);
  if (error) {
    log(logMessage);
    return;
  }

  const entities = getEntitiesFromSchema(schema);
  const compilerOptions = getCompilerOptionsFromSchema(schema);
  const typeGraph = getTypeGraphFromSchema(schema);
  switch (output) {
    case 'typescript':
      typescriptGenerator(typescriptOut as string, entities, {
        typeGraph,
      });
      break;

    case 'java':
      javaGenerator(javaOut as string, entities, {
        ...compilerOptions.java,
        typeGraph,
      });
      break;

    case 'go':
      goGenerator(goOut as string, entities, compilerOptions.go);
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
    const schema = JSON.parse(data);
    validateAndGenerateOutput(schema);
  });
})();

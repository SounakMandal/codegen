#!/usr/bin/env node

import { readFile } from 'fs';
import { init } from './utils/cmd/init';
import { Command } from 'commander';
import log from './utils/cmd/log';
import typescriptGenerator from './generator/typescript/write';
import javaGenerator from './generator/java/write';
import goGenerator from './generator/go/write';
import {
  getCompilerOptionsFromSchema,
  getEntitiesFromSchema,
} from './utils/schema/extractor';
import { getTypeGraphFromSchema } from './utils/schema/graph';
import { validateCommand } from './validator/cli';
import { validateSchema } from './validator/file';

init({
  title: 'codegen',
  tagLine: 'by Sounak Mandal',
  bgColor: '#36BB09',
  color: '#000000',
  bold: true,
  clear: true,
});

const program = new Command();

program
  .name('codegen')
  .description('CLI for code generation')
  .option('-c, --clear', 'Clear the console', true)
  .option('--no-clear', "Don't clear the console", false)
  .option('-d, --debug', 'Print debug info', true)
  .option('-f, --file <string>', 'Input file for code generation (required)')
  .option('-o, --output <string>', 'The output language (required)')
  .option('-t, --typescript-out <string>', 'The TypeScript module where the code should be generated')
  .option('-j, --java-out <string>', 'The Java package where the code should be generated')
  .option('-g, --go-out <string>', 'The Golang package where the code should be generated');

program.parse(process.argv);

const options = program.opts();
const { error, logMessage } = validateCommand(options);
if (error) {
  log('error', 'ERROR LOG', logMessage);
  process.exit(1);
}

const { file, debug, output, typescriptOut, javaOut, goOut } = options;
readFile(file as string, 'utf8', (err: any, data: string) => {
  if (err) {
    log('error', 'ERROR LOG', '--file argument has invalid file location');
    process.exit(1);
  }

  const schema = JSON.parse(data);
  const { error, logMessage } = validateSchema(output, schema);
  if (error) {
    log('error', 'ERROR LOG', logMessage);
    process.exit(1);
  }
  const entities = getEntitiesFromSchema(schema);
  const typeGraph = getTypeGraphFromSchema(schema);
  const compilerOptions = getCompilerOptionsFromSchema(schema);
  let logs: string[];
  switch (output) {
    case 'typescript':
      if (!typescriptOut) {
        log('error', 'ERROR LOG', '--typescript-out is required when output is typescript');
        process.exit(1);
      }
      logs = typescriptGenerator(typescriptOut as string, entities, { typeGraph });
      break;

    case 'java':
      if (!javaOut) {
        log('error', 'ERROR LOG', '--java-out is required when output is java');
        process.exit(1);
      }
      logs = javaGenerator(javaOut as string, entities, { ...compilerOptions.java, typeGraph });
      break;

    case 'go':
      if (!goOut) {
        log('error', 'ERROR LOG', '--go-out is required when output is go');
        process.exit(1);
      }
      logs = goGenerator(goOut as string, entities, compilerOptions.go);
      break;

    default:
      log('error', 'ERROR LOG', 'Unsupported output language specified');
      process.exit(1);
  }

  if (debug) {
    log('success', 'SUCCESS LOG', '');
    logs.forEach((logMessage) => console.log(logMessage));
  }
});

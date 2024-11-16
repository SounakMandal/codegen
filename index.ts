#!/usr/bin/env node

import { readFile } from 'fs';
import { init } from './utils/cmd/init';
import { Command } from 'commander';
import { typescriptClientGenerator, typescriptEntityGenerator } from './generator/typescript/write';
import { javaEntityGenerator } from './generator/java/write';
import { goEntityGenerator } from './generator/go/write';
import {
  getCompilerOptionsFromSchema,
  getEndpointOptionsFromSchema,
  getEntitiesFromSchema,
} from './utils/schema/extractor';
import { getTypeGraphFromSchema } from './utils/schema/graph';
import { logger } from './utils/logger';
import { validateCommand } from './validator/cli';
import { validateSchema } from './validator/file';
import { GoOptions, JavaOptions, TypescriptOptions } from './interface/schema';

init({
  title: 'codegen',
  tagLine: 'by Sounak Mandal',
  bgColor: '#36BB09',
  color: '#000000',
  bold: true,
  clear: false,
});

const program = new Command();

program
  .name('codegen')
  .description('CLI for code generation')
  .option('-t, --types', 'Generates typed models', true)
  .option('-c, --client', 'Generates client code', false)
  .option('-v, --verbose', 'Print verbose info', true)
  .option('-q, --quiet', 'Disable logging', false)
  .option('-f, --file <string>', 'Input file for code generation (required)')
  .option('-o, --output <string>', 'The output language (required)')
  .option('--typescript-out <string>', 'The TypeScript module where the code should be generated')
  .option('--java-out <string>', 'The Java package where the code should be generated')
  .option('--go-out <string>', 'The Golang package where the code should be generated');

program.parse(process.argv);

const options = program.opts();
const { file, types, output, client, typescriptOut, javaOut, goOut } = options;

validateCommand(options);

readFile(file as string, 'utf8', (err: any, data: string) => {
  if (err) {
    logger.error('--file argument has invalid file location');
    process.exit(1);
  }

  const schema = JSON.parse(data);
  validateSchema(output, client, schema);

  let outputDirectoryPath;
  const entities = getEntitiesFromSchema(schema);
  const typeGraph = getTypeGraphFromSchema(schema);
  const endpoints = getEndpointOptionsFromSchema(schema);
  const compilerOptions = getCompilerOptionsFromSchema(schema);
  switch (output) {
    case 'typescript':
      if (!typescriptOut) {
        logger.error('--typescript-out is required when output is typescript');
        process.exit(1);
      }
      outputDirectoryPath = typescriptOut as string;
      const typescriptOptions = compilerOptions.typescript as TypescriptOptions;
      if (types) typescriptEntityGenerator(outputDirectoryPath, entities, { ...typescriptOptions, typeGraph });
      if (client) typescriptClientGenerator(outputDirectoryPath, entities, endpoints, { ...typescriptOptions, typeGraph });
      break;

    case 'java':
      if (!javaOut) {
        logger.error('--java-out is required when output is java');
        process.exit(1);
      }
      outputDirectoryPath = javaOut as string;
      const javaOptions = compilerOptions.java as JavaOptions;
      if (types) javaEntityGenerator(outputDirectoryPath, entities, { ...javaOptions, typeGraph });
      break;

    case 'go':
      if (!goOut) {
        logger.error('--go-out is required when output is go');
        process.exit(1);
      }
      outputDirectoryPath = goOut as string;
      const goOptions = compilerOptions.go as GoOptions;
      if (types) goEntityGenerator(outputDirectoryPath, entities, { ...goOptions });
      break;

    default:
      logger.error('Unsupported output language specified');
      process.exit(1);
  }
});

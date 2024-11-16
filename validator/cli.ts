import { OptionValues } from 'commander';
import { logger } from '../utils/logger';

export function validateCommand(options: OptionValues) {
  const { verbose, quiet } = options;

  // Configure logger
  if (verbose) {
    logger.level = 'debug';
    if (quiet) {
      logger.warn('--verbose and --quiet should not be used together');
      logger.warn('Using --verbose and ignoring --quiet');
    }
  } else if (quiet) {
    logger.level = 'error';
  } else {
    logger.level = 'info';
    logger.warn('--verbose and --quiet are both set as false');
    logger.warn('Logging level will be set as info');
  }

  // Check that either client or types have to be generated
  const { client, types } = options;
  if (!client && !types) {
    logger.warn('Nothing to generate');
    process.exit(0);
  }

  // Check if required options are provided
  const { file, output } = options;
  if (!file) {
    logger.error('--file is a mandatory argument');
    process.exit(1);
  }

  if (!output) {
    logger.error('--output is a mandatory argument');
    process.exit(1);
  }

  // Conditional validation based on the output type
  const { typescriptOut, javaOut, goOut } = options;
  switch (output) {
    case 'typescript':
      if (!typescriptOut) {
        logger.error('--typescript-out is a mandatory argument when --output is typescript');
        process.exit(1);
      }
      break;

    case 'java':
      if (!javaOut) {
        logger.error('--java-out is a mandatory argument when --output is java');
        process.exit(1);
      }
      break;

    case 'go':
      if (!goOut) {
        logger.error('--go-out is a mandatory argument when --output is go');
        process.exit(1);
      }
      break;

    default:
      logger.error('Output language not supported yet');
      process.exit(1);
  }
}

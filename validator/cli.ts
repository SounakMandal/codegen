import { OptionValues } from 'commander';

export function validateCommand(options: OptionValues) {
  let error = false;
  let logMessage = '';
  const { file, output, typescriptOut, javaOut, goOut } = options;

  // Check if required options are provided
  if (!file) {
    logMessage += '--file is a mandatory argument\n';
    error = true;
  }

  if (!output) {
    logMessage += '--output is a mandatory argument\n';
    error = true;
  }

  // Conditional validation based on the output type
  switch (output) {
    case 'typescript':
      if (!typescriptOut) {
        logMessage +=
          '--typescript-out is a mandatory argument when --output is typescript\n';
        error = true;
      }
      break;

    case 'java':
      if (!javaOut) {
        logMessage +=
          '--java-out is a mandatory argument when --output is java\n';
        error = true;
      }
      break;

    case 'go':
      if (!goOut) {
        logMessage += '--go-out is a mandatory argument when --output is go\n';
        error = true;
      }
      break;

    default:
      logMessage += 'Output language not supported yet\n';
      error = true;
  }

  return { error, logMessage };
}

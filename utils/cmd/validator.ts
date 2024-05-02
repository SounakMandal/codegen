import { TypedFlags } from 'meow';

export function validateCommand(flags: TypedFlags<any>) {
  let error = false;
  let logMessage = '';
  const { file, output, typescriptOut, javaOut, goOut } = flags as {
    [key: string]: string | boolean;
  };

  if (file === undefined) {
    logMessage += '--file is a mandatory arguement\n';
    error = true;
  }

  if (output === undefined) {
    logMessage += '--output is a mandatory arguement\n';
    error = true;
  }

  switch (output) {
    case 'typescript':
      if (typescriptOut === undefined) {
        logMessage +=
          '--typescript_out is a mandatory arguement when --output is typescript\n';
        error = true;
      }
      break;

    case 'java':
      if (javaOut === undefined) {
        logMessage +=
          '--java_out is a mandatory arguement when --output is java\n';
        error = true;
      }
      break;

    case 'go':
      if (goOut === undefined) {
        logMessage += '--go_out is a mandatory arguement when --output is go\n';
        error = true;
      }
      break;

    default:
      logMessage += 'output language not supported yet';
      error = true;
  }

  return { error, logMessage };
}

import chalk from 'chalk';
import { name, description, version } from '../../package.json';

// Function to clear the console
const clearConsole = () => process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');

export const init = (options = {}) => {
  // Default options
  const defaultOptions = {
    tagLine: '',
    bgColor: '#ffffff',
    color: '#000000',
    bold: true,
    clear: true,
  };
  const opts = { ...defaultOptions, ...options };
  const {
    tagLine,
    bgColor,
    color,
    bold,
    clear,
  } = opts;

  // Configure styling
  const bg = bold
    ? chalk.hex(bgColor).inverse.bold
    : chalk.hex(bgColor).inverse;
  const clr = bold ? chalk.hex(color).bold : chalk.hex(color);

  // Display welcome message
  if (clear) clearConsole();
  const dim = chalk.dim;
  console.log();
  console.log(
    `${ clr(`${ bg(` ${ name } `) }`) } v${ version } ${ dim(tagLine) }\n${ dim(description) }`
  );
  console.log();
};

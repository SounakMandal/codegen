/**
 * CLI Alerts.
 *
 * Cross platform CLI Alerts with colors.
 * Works on macOS, Linux, and Windows.
 * Alerts: `success`, `info`, `warning`, `error`.
 *
 * @author Sounak Mandal
 */
import chalk from "chalk";

const green = chalk.green;
const greenI = chalk.green.inverse;
const red = chalk.red;
const redI = chalk.red.bold.inverse;
const orange = chalk.keyword('orange');
const orangeI = chalk.keyword('orange').inverse;
const blue = chalk.blue;
const blueI = chalk.blue.inverse;

type AlertType = 'success' | 'warning' | 'info' | 'error';

type AlertOptions = {
  type: AlertType,
  heading: string,
  message: string,
};

const alert = (options: AlertOptions) => {
  const defaultOptions = {
    type: `error`,
    message: `You forgot to define all options.`,
    heading: ``
  };
  const opts = { ...defaultOptions, ...options };
  const { type, message, heading } = opts;
  const printName = heading ? heading : type.toUpperCase();

  switch (type) {
    case 'success':
      console.log(`\n${ greenI(` ${ printName } `) } ${ green(message) }\n`);
      break;
    case 'warning':
      console.log(`\n${ orangeI(` ${ printName } `) } ${ orange(message) }\n`);
      break;
    case 'info':
      console.log(`\n${ blueI(` ${ printName } `) } ${ blue(message) }\n`);
      break;
    case 'error':
      console.log(`\n${ redI(` ${ printName } `) } ${ red(message) }\n`);
      break;
  }
};

export default (type: AlertType, heading: string, info: any) => {
  alert({ type, heading, message: `` });
  console.log(info);
};

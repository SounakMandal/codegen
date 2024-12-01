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
  message: string,
};

const alert = (options: AlertOptions) => {
  const { type, message } = options;
  switch (type) {
    case 'success':
      console.log(`\n${ green(message) }\n`);
      break;
    case 'warning':
      console.log(`\n${ orange(message) }\n`);
      break;
    case 'info':
      console.log(`\n${ blue(message) }\n`);
      break;
    case 'error':
      console.log(`\n${ red(message) }\n`);
      break;
  }
};

export default (type: AlertType, info: any) => {
  alert({ type, message: info });
};

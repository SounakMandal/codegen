import meow, { Options } from 'meow';
import meowHelp from 'cli-meow-help';

export const flags = {
  clear: {
    type: `boolean`,
    default: true,
    alias: `c`,
    desc: `Clear the console`,
  },
  noClear: {
    type: `boolean`,
    default: false,
    desc: `Don't clear the console`,
  },
  debug: {
    type: `boolean`,
    default: false,
    alias: `d`,
    desc: `Print debug info`,
  },
  version: {
    type: `string`,
    alias: `v`,
    desc: `Print CLI version`,
  },
  file: {
    type: `string`,
    alias: `f`,
    desc: `Input file for code generation`,
  },
  output: {
    type: `string`,
    alias: `o`,
    desc: `The output languages`,
  },
  typescript_out: {
    type: `string`,
    alias: `t`,
    desc: `The typescript module where the code should be generated`,
  },
  java_out: {
    type: `string`,
    alias: `j`,
    desc: `The java package where the code should be generated`,
  },
  go_out: {
    type: `string`,
    alias: `g`,
    desc: `The golang package where the code should be generated`,
  },
};

const commands = {
  help: { desc: `Print help info` },
};

const helpText = meowHelp({
  name: `codegen`,
  flags,
  commands,
});

const options: Options<any> = {
  inferType: true,
  description: false,
  hardRejection: false,
  allowUnknownFlags: false,
  flags,
};

export default meow(helpText, options);

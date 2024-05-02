import welcome from 'cli-welcome';
import { description, version } from '../../package.json';
import unhandled from 'cli-handle-unhandled';

export default ({ clear = true }) => {
  unhandled();
  welcome({
    title: `codegen`,
    tagLine: `by Sounak Mandal`,
    description,
    version,
    bgColor: '#36BB09',
    color: '#000000',
    bold: true,
    clear,
  });
};

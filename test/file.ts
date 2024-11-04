import path from 'path';
import { readFileSync } from 'fs';
import { execSync } from 'child_process';

const cliPath = path.resolve(__dirname, '../index.ts');

export const runCLI = (args: string[]) => {
  try {
    return execSync(`npx ts-node ${ cliPath } ${ args.join(' ') }`, { encoding: 'utf-8' });
  } catch (error: any) {
    return error.stdout;
  }
};

export const runHelp = () => {
  return execSync(`npx ts-node ${ cliPath } --help`);
};

export const folderPath = './output';
export function testFileContents(filePath: string, ...items: string[]) {
  const data = readFileSync(filePath, 'utf-8');
  items.forEach((item) => expect(data).toContain(item));
}

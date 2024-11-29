import path from 'path';
import { readFileSync } from 'fs';
import { execFileSync } from 'child_process';

const cliPath = path.resolve(__dirname, '../index.ts');

export const runCLI = (args: string[]) => {
  try {
    return execFileSync('npx', ['ts-node', cliPath, ...args], { encoding: 'utf-8' });
  } catch (error: any) {
    return error.stdout;
  }
};

export const runHelp = () => {
  return execFileSync('npx', ['ts-node', cliPath, '--help']);
};

export const folderPath = './output';
export function testFileContents(filePath: string, ...items: string[]) {
  const data = readFileSync(filePath, 'utf-8');
  items.forEach((item) => expect(data).toContain(item));
}

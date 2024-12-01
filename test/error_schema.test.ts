import { runCLI } from './file';

describe('Error schemas', () => {
  it('should return an error when the file option is missing', () => {
    const output = runCLI(['--file=test/invalid/endpoints.json', '--client', '--output=typescript', '--typescript-out=output/typescript']);
    expect(output).toContain('endpoints is mandatory when --client is true');
  });
});

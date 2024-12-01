import { runCLI } from './file';

describe('Error commands', () => {
  it('should return an error when the file option is missing', () => {
    const output = runCLI(['--output=typescript', '--typescript-out=output/typescript']);
    expect(output).toContain('--file is a mandatory argument');
  });

  it('should return an error when the output option is missing', () => {
    const output = runCLI(['--file=test/contract.json', '--typescript-out=output/typescript']);
    expect(output).toContain('--output is a mandatory argument');
  });

  it('should return an error when the typescript-out option is missing for typescript output', () => {
    const output = runCLI(['--file=test/contract.json', '--output=typescript']);
    expect(output).toContain('--typescript-out is a mandatory argument when --output is typescript');
  });

  it('should return an error when the java-out option is missing for java output', () => {
    const output = runCLI(['--file=test/contract.json', '--output=java']);
    expect(output).toContain('--java-out is a mandatory argument when --output is java');
  });

  it('should return an error when the go-out option is missing for go output', () => {
    const output = runCLI(['--file=test/contract.json', '--output=go']);
    expect(output).toContain('--go-out is a mandatory argument when --output is go');
  });

  it('should return an error for unsupported output languages', () => {
    const output = runCLI(['--file=test/contract.json', '--output=cpp']);
    expect(output).toContain('Output language not supported yet');
  });

  it('should return an error when the input file does not exist', () => {
    const output = runCLI(['--file=invalid_file.json', '--output=typescript', '--typescript-out=output/typescript']);
    expect(output).toContain('--file argument has invalid file location');
  });
});

import { runCLI } from './file';

describe('Help command', () => {
  it('should display help information for all flags', () => {
    const output = runCLI(['--help']);
    expect(output).toContain('CLI for code generation');
    expect(output).toContain('Options:');
    expect(output).toContain('-c, --clear');
    expect(output).toContain('--no-clear');
    expect(output).toContain('-d, --debug');
    expect(output).toContain('-f, --file <string>');
    expect(output).toContain('-o, --output <string>');
    expect(output).toContain('-t, --typescript-out <string>');
    expect(output).toContain('-j, --java-out <string>');
    expect(output).toContain('-g, --go-out <string>');
    expect(output).toContain('-h, --help');
  });
});

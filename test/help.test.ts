import { runCLI } from './file';

describe('Help command', () => {
  it('should display help information for all flags', () => {
    const output = runCLI(['--help']);
    expect(output).toContain('CLI for code generation');
    expect(output).toContain('Options:');
    expect(output).toContain('-t, --types');
    expect(output).toContain('-c, --client');
    expect(output).toContain('-v, --verbose');
    expect(output).toContain('-q, --quiet');
    expect(output).toContain('-f, --file <string>');
    expect(output).toContain('-o, --output <string>');
    expect(output).toContain('--typescript-out <string>');
    expect(output).toContain('--java-out <string>');
    expect(output).toContain('--go-out <string>');
    expect(output).toContain('-h, --help');
  });
});

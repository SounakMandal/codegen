import { runCLI } from './file';

describe('Valid Commands', () => {
  it('should generate TypeScript code when valid TypeScript options are provided', () => {
    const output = runCLI(['--file=test/contract.json', '--output=typescript', '--typescript-out=output/typescript']);
    expect(output).toContain('SUCCESS LOG');
    expect(output).toContain('Creating directory output/typescript');
    expect(output).toContain('File output/typescript/user_details.ts written successfully with entity user_details');
    expect(output).toContain('File output/typescript/user_role.ts written successfully with entity user_role');
    expect(output).toContain('File output/typescript/account_details.ts written successfully with entity account_details');
    expect(output).toContain('File output/typescript/transaction.ts written successfully with entity transaction');
  });

  it('should generate Java code when valid Java options are provided', () => {
    const output = runCLI(['--file=test/contract.json', '--output=java', '--java-out=output/java']);
    expect(output).toContain('SUCCESS LOG');
    expect(output).toContain('Creating directory output/java');
    expect(output).toContain('File output/java/com/controller/models/UserDetails.java written successfully with entity user_details');
    expect(output).toContain('File output/java/com/controller/models/UserRole.java written successfully with entity user_role');
    expect(output).toContain('File output/java/com/controller/models/AccountDetails.java written successfully with entity account_details');
    expect(output).toContain('File output/java/com/controller/models/Transaction.java written successfully with entity transaction');
  });

  it('should generate Go code when valid Go options are provided', () => {
    const output = runCLI(['--file=test/contract.json', '--output=go', '--go-out=output/golang']);
    expect(output).toContain('SUCCESS LOG');
    expect(output).toContain('Creating directory output/golang');
    expect(output).toContain('File output/golang/user_details.go written successfully with entity user_details');
    expect(output).toContain('File output/golang/user_role.go written successfully with entity user_role');
    expect(output).toContain('File output/golang/account_details.go written successfully with entity account_details');
    expect(output).toContain('File output/golang/transaction.go written successfully with entity transaction');
  });
});

import { execSync } from 'child_process';

// Checks if the file in created
describe('Test file creation without errors', () => {
  test('Typescript Files are created without error', () => {
    const result = execSync(
      `npx ts-node index.ts --file=test/contract.json --output=typescript --typescript_out=output/typescript`,
    );
    expect(result.toString().includes('DEBUG LOG')).toBe(false);
  });

  test('Java Files are created without error', () => {
    const result = execSync(
      `npx ts-node index.ts --file=test/contract.json --output=java --java_out=output/java`,
    );
    expect(result.toString().includes('DEBUG LOG')).toBe(false);
  });

  test('Typescript Files are created without error', () => {
    const result = execSync(
      `npx ts-node index.ts --file=test/contract.json --output=go --go_out=output/golang`,
    );
    expect(result.toString().includes('DEBUG LOG')).toBe(false);
  });
});

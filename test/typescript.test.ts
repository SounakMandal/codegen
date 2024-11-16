import { folderPath, runCLI, testFileContents } from './file';

describe('Typescript Output', () => {
  const typescriptPath = 'typescript/models';
  it('should conatin correct type defintion', () => {
    runCLI(['--file=test/contract.json', '--output=typescript', '--typescript-out=output/typescript', '--verbose']);
    testFileContents(`${ folderPath }/${ typescriptPath }/account_details.ts`, 'AccountDetails', 'Type');
    testFileContents(`${ folderPath }/${ typescriptPath }/transaction.ts`, 'Transaction', 'Recepient', 'Item');
    testFileContents(`${ folderPath }/${ typescriptPath }/user_details.ts`, 'UserDetails', 'Address', 'ContactInformation');
    testFileContents(`${ folderPath }/${ typescriptPath }/user_role.ts`, 'UserRole');
  });
});

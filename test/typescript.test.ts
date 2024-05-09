import { folderPath, runCLI, testFileContents } from './file';

describe('Typescript Output', () => {
  it('should conatin correct type defintion', () => {
    runCLI(['--file=test/contract.json', '--output=typescript', '--typescript-out=output/typescript', '--debug']);
    testFileContents(`${ folderPath }/typescript/account_details.ts`, 'AccountDetails', 'Type');
    testFileContents(`${ folderPath }/typescript/transaction.ts`, 'Transaction', 'Recepient', 'Item');
    testFileContents(`${ folderPath }/typescript/user_details.ts`, 'UserDetails', 'Address', 'ContactInformation');
    testFileContents(`${ folderPath }/typescript/user_role.ts`, 'UserRole');
  });
});

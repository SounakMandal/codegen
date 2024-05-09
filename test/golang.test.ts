import { folderPath, runCLI, testFileContents } from './file';

describe('Golang Output', () => {
  it('should conatin correct type defintion', () => {
    runCLI(['--file=test/contract.json', '--output=typescript', '--typescript-out=output/typescript', '--debug']);
    testFileContents(`${ folderPath }/golang/account_details.go`, 'AccountDetails', 'Type');
    testFileContents(`${ folderPath }/golang/transaction.go`, 'Transaction', 'Recepient', 'Item');
    testFileContents(`${ folderPath }/golang/user_details.go`, 'UserDetails', 'Address', 'ContactInformation');
    testFileContents(`${ folderPath }/golang/user_role.go`, 'UserRole');
  });
});

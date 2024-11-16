import { folderPath, runCLI, testFileContents } from './file';

describe('Golang Output', () => {
  const goPath = 'golang/models';
  it('should conatin correct type defintion', () => {
    runCLI(['--file=test/contract.json', '--output=typescript', '--typescript-out=output/typescript', '--verbose']);
    testFileContents(`${ folderPath }/${ goPath }/account_details.go`, 'AccountDetails', 'Type');
    testFileContents(`${ folderPath }/${ goPath }/transaction.go`, 'Transaction', 'Recepient', 'Item');
    testFileContents(`${ folderPath }/${ goPath }/user_details.go`, 'UserDetails', 'Address', 'ContactInformation');
    testFileContents(`${ folderPath }/${ goPath }/user_role.go`, 'UserRole');
  });
});

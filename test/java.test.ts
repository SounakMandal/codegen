import { folderPath, runCLI, testFileContents } from './file';

describe('Java Output', () => {
  const javaPath = 'java/com/controller/models';
  it('should conatin correct type defintion', () => {
    runCLI(['--file=test/contract.json', '--output=typescript', '--typescript-out=output/typescript', '--debug']);
    testFileContents(`${ folderPath }/${ javaPath }/AccountDetails.java`, 'AccountDetails', 'Type');
    testFileContents(`${ folderPath }/${ javaPath }/Transaction.java`, 'Transaction', 'Recepient', 'Item');
    testFileContents(`${ folderPath }/${ javaPath }/UserDetails.java`, 'UserDetails', 'Address', 'ContactInformation');
    testFileContents(`${ folderPath }/${ javaPath }/UserRole.java`, 'UserRole');
  });
});

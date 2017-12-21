const Inception = require('../lib');
const path = require('path');
const fs = require('fs-extra');

describe('yeoman generator test', () => {
  let inception;

  beforeAll(done => {
    inception = new Inception(path.join(__dirname, 'tempDir1'));
    inception.copyPackageJson(
      path.join(__dirname, '../testapp/templates/_package.json'),
      path.join(__dirname, 'tempDir1/package.json'), {
        someAnswer: true
      }
    );
    return inception.npmInstall()
      .then(() => inception.runGen(path.join(__dirname, '../testapp'), { someAnswer: true }))
      .then(() => done())
      .catch(err => done());
  }, 200000);

  it('should have installed correct deps', () => {

    expect(fs.pathExistsSync(path.join(__dirname, 'tempDir1/node_modules/chai'))).toBeTruthy();
    expect(fs.pathExistsSync(path.join(__dirname, 'tempDir1/node_modules/chai-as-promised'))).toBeTruthy();
    expect(fs.pathExistsSync(path.join(__dirname, 'tempDir1/node_modules/babel-plugin-transform-runtime'))).toBeTruthy();
    expect(fs.pathExistsSync(path.join(__dirname, 'tempDir1/node_modules/babel-core'))).toBeTruthy();
  });

  it('should pass', async () => {
    await expect(inception.runAsyncCommand('npm', ['run', 'test-pass'])).resolves.toBe(0);
  }, 200000);

  it('should fail', async () => {
    await expect(inception.runAsyncCommand('npm', ['run', 'test-fail'])).rejects.toBe(1);
  }, 200000);

  afterAll(() => {
    inception.clean();
  });
});

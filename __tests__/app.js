const chai = require('chai');
const expect = chai.expect;
const Inception = require('../lib');
const path = require('path');
const fs = require('fs-extra');
chai.use(require('chai-as-promised'));

describe('yeoman generator test', () => {
  let inception;
  beforeAll(done => {
    inception = new Inception(path.join(__dirname, 'fixtures1'));
    inception.copyPackageJson(
      path.join(__dirname, '../testapp/templates/_package.json'),
      path.join(__dirname, 'fixtures1/package.json'), {
        someAnswer: true
      }
    );
    return inception.npmInstall(true)
      .then(done)
      .catch(err => {
        console.log(err);
        done();
      });

  }, 60000);

  it('should have installed correct deps', () => {
    expect(fs.pathExistsSync(path.join(__dirname, 'fixtures1/node_modules/chai'))).to.be.true;
    expect(fs.pathExistsSync(path.join(__dirname, 'fixtures1/node_modules/chai-as-promised'))).to.be.true;
    expect(fs.pathExistsSync(path.join(__dirname, 'fixtures1/node_modules/babel-plugin-transform-runtime'))).to.be.true;
    expect(fs.pathExistsSync(path.join(__dirname, 'fixtures1/node_modules/babel-core'))).to.be.true;
  });

  it('should pass', done => {

    inception.run(path.join(__dirname, '../testapp'), { someAnswer: true })
      .then(() => inception.runAsyncCommand('npm run test-pass'))
      .then(code => {
        expect(code).to.equal(0);
        done();
      });
  }, 10000);

  it('should fail', done => {
    inception.run(path.join(__dirname, '../testapp'), { someAnswer: true })
      .then(() => inception.runAsyncCommand('npm run test-fail'))
      .catch(code => {
        expect(code).to.equal(1);
        done();
      });
  }, 10000);

  afterAll(() => {
    inception.clean();
  });
});

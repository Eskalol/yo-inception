const chai = require('chai');
const expect = chai.expect;
const path = require('path');
const fs = require('fs-extra');
const Inception = require('../lib');
chai.use(require('chai-as-promised'));

describe('npm install', () => {
  let inception;
  beforeAll(done => {
    inception = new Inception(path.join(__dirname, 'fixtures2'));
    inception.copyPackageJson(
      path.join(__dirname, '_package.json'),
      path.join(__dirname, 'fixtures2/package.json'), {
        name: 'super-cool-name',
        author: 'a really cool author',
        description: 'cool description',
        express: true
      }
    );
    inception.npmInstall()
      .then(done)
      .catch(err => {
        done();
      });
  }, 20000);
  it('should copy package corectly', () => {
    expect(fs.pathExists(path.join(__dirname, 'fixtures2/node_modules/express'))).to.eventually.be.true;
  });

  afterAll(() => {
    inception.clean();
  });
});

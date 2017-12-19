const path = require('path');
const fs = require('fs-extra');
const Inception = require('../lib');

describe('yarn install', () => {
  let inception;

  beforeAll(done => {
    inception = new Inception(path.join(__dirname, 'tempDir3'));
    inception.copyPackageJson(
      path.join(__dirname, '_package.json'), {
        name: 'super-cool-name',
        author: 'a really cool author',
        description: 'cool description',
        express: true
      }
    );
    return inception.yarnInstall(false)
      .then(() => done())
      .catch(() => done());
  }, 120000);

  it('should copy package corectly', () => {
    expect(fs.pathExists(path.join(__dirname, 'tempDir3/node_modules/express'))).toBeTruthy();
  });

  afterAll(() => {
    inception.clean();
  });
});

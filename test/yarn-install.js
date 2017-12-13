import chai, { expect } from 'chai';
import Inception from '../dist';
import path from 'path';
import fs from 'fs';
chai.use(require('chai-as-promised'));

describe('yarn install', () => {
  let inception;
  before(done => {
    inception = new Inception(path.join(__dirname, 'fixtures'));
    inception.copyPackageJson(
      path.join(__dirname, '_package.json'),
      path.join(__dirname, 'fixtures/package.json'), {
        name: 'super-cool-name',
        author: 'a really cool author',
        description: 'cool description',
        express: true
      }
    );
    inception.yarnInstall(false)
      .then(done)
      .catch(err => {
        console.log(err);
        done();
      });
  });
  it('should copy package corectly', () => {
    fs.exists(path.join(__dirname, 'fixtures/node_modules/express'), exists => {
      expect(exists).to.be.true;
    });
  });

  after(() => {
    inception.clean();
  });
});

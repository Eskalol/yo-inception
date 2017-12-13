import chai, { expect } from 'chai';
import Inception from '../dist';
import path from 'path';
import fs from 'fs';
chai.use(require('chai-as-promised'));

describe('npm install', () => {
  let inception;
  before(done => {
    inception = new Inception();
    inception.copyPackageJson(
      path.join(__dirname, 'fixtures/_package.json'),
      path.join(__dirname, 'fixtures/package.json'), {
        name: 'super-cool-name',
        author: 'a really cool author',
        description: 'cool description',
        express: true
      }
    );
    inception.npmInstall(
      path.join(__dirname, 'fixtures/'),
      true)
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
    inception.cleanFixtures(__dirname, 'fixtures/node_modules');
  });
});

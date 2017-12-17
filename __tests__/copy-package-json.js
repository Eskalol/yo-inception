const chai = require('chai');
const expect = chai.expect;
const path = require('path');
const fs = require('fs-extra');
const Inception = require('../lib');
chai.use(require('chai-as-promised'));


describe('copy package json template', () => {
  let inception;
  beforeAll(() => {
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
  });
  it('should copy package corectly', () => {
    let fs = inception.getFs();
    expect(fs.read(path.join(__dirname, 'fixtures/package.json'))).to.include('express');
    expect(fs.read(path.join(__dirname, 'fixtures/package.json'))).to.include('super-cool-name');
    expect(fs.read(path.join(__dirname, 'fixtures/package.json'))).to.include('a really cool author');
    expect(fs.read(path.join(__dirname, 'fixtures/package.json'))).to.include('cool description');
    expect(fs.exists(path.join(__dirname, 'fixtures/package.json'))).to.be.true;
  });

  afterAll(() => {
    inception.clean();
  });
});

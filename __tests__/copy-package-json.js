const path = require('path');
const fs = require('fs-extra');
const Inception = require('../lib');

describe('copy package json template', () => {
  let inception;

  beforeAll(() => {
    inception = new Inception(path.join(__dirname, 'tempDir0'));
    inception.copyPackageJson(
      path.join(__dirname, '_package.json'), {
        name: 'super-cool-name',
        author: 'a really cool author',
        description: 'cool description',
        express: true
      }
    );
  });

  it('should copy package corectly', () => {
    let fs = inception.getFs();
    expect(fs.read(path.join(__dirname, 'tempDir0/package.json'))).toContain('express');
    expect(fs.read(path.join(__dirname, 'tempDir0/package.json'))).toContain('super-cool-name');
    expect(fs.read(path.join(__dirname, 'tempDir0/package.json'))).toContain('a really cool author');
    expect(fs.read(path.join(__dirname, 'tempDir0/package.json'))).toContain('cool description');
    expect(fs.exists(path.join(__dirname, 'tempDir0/package.json'))).toBeTruthy();
  });

  afterAll(() => {
    inception.clean();
  });
});

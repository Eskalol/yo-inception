import chai, { expect } from 'chai';
import Inception from '../dist';
import path from 'path';
import fs from 'fs';
chai.use(require('chai-as-promised'));


describe('copy package json template', () => {
  let inception;
  before(() => {
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
  });
  it('should copy package corectly', () => {
    let fs = inception.getFs();
    expect(fs.read(path.join(__dirname, 'fixtures/package.json'))).to.include('express');
    expect(fs.read(path.join(__dirname, 'fixtures/package.json'))).to.include('super-cool-name');
    expect(fs.read(path.join(__dirname, 'fixtures/package.json'))).to.include('a really cool author');
    expect(fs.read(path.join(__dirname, 'fixtures/package.json'))).to.include('cool description');
  });
});

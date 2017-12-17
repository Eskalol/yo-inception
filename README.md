[![Build Status][travis-image]][travis-url] [![codecov][codecov-image]][codecov-url] [![dependencies Status][daviddm-image]][daviddm-url] [![devDependencies Status][daviddm-dev-image]][daviddm-dev-url]
> Imagine if you could run your generated tests within your yeoman generator tests, just as simple as dreaming within a dream... Lol


# Examples
> More examples coming soon...

## Copy and process package.json into tempDir
```javascript
const Inception = require('yo-inception');
const path = require('path');
const inception = new Inception(path.join(__dirname, 'tempDir');
inception.copyPackageJson(
  path.join(__dirname, '../path/to/generator/_package.json'), {
    someAnswer: true
  });
```

## Install dependencies into tempDir (package.json required in tempDir)
```javascript
const Inception = require('yo-inception');
const path = require('path');
const inception = new Inception(path.join(__dirname, 'tempDir');
// with npm
inception.npmInstall();
// or with yarn
inception.yarnInstall();
```

## Run test command on generated code (node_modules needs to be present in tempDir)
```javascript
const Inception = require('yo-inception');
const path = require('path');
const inception = new Inception(path.join(__dirname, 'tempDir');
inception.runGen(path.join(__dirname, '../path/to/gen'), { someAnswer: true })
  .then(() => inception.runAsyncCommand('gulp test'));
```

## Clean TempDir
```javascript
const Inception = require('yo-inception');
const path = require('path');
const inception = new Inception(path.join(__dirname, 'tempDir');
inception.clean(); // removes tempDir
```

## Jasmine Example
```javascript
describe('run generated tests', () => {
  let inception;

  beforeAll(done => {
    inception = new Inception(path.join(__dirname, 'tempDir'));
    inception.copyPackageJson(
      path.join(__dirname, '../testapp/templates/_package.json'),
      path.join(__dirname, 'tempDir1/package.json'), {
        someAnswer: true
      }
    );
    return inception.npmInstall(true)
      .then(done)
      .catch(err => {
        console.log(err);
        done();
      });

  });

  it('should pass', done => {
    inception.runGen(path.join(__dirname, '../testapp'), { someAnswer: true })
      .then(() => inception.runAsyncCommand('npm run test-pass'))
      .then(code => {
        expect(code).to.equal(0);
        done();
      });
  });

  afterAll(() => {
    inception.clean();
  });
});
```

[travis-image]: https://img.shields.io/travis/Eskalol/yo-inception/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/Eskalol/yo-inception
[codecov-url]: https://codecov.io/gh/Eskalol/yo-inception
[codecov-image]: https://img.shields.io/codecov/c/github/Eskalol/yo-inception.svg?style=flat-square
[daviddm-image]: http://img.shields.io/david/github/Eskalol/yo-inception.svg?style=flat-square
[daviddm-url]: https://david-dm.org/github/Eskalol/yo-inception
[daviddm-dev-url]: https://david-dm.org/github/Eskalol/yo-inception?type=dev
[daviddm-dev-image]: https://img.shields.io/david/dev/github/Eskalol/yo-inception.svg?style=flat-square

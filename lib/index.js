const memFs = require('mem-fs');
const FileEditor = require('mem-fs-editor');
const fs = require('fs-extra');
const exec = require('child_process').exec;
const helpers = require('yeoman-test');
const lol = require('path');


module.exports = class Inception {
  constructor(path) {
    this.fs = FileEditor.create(memFs.create());
    this.path = path;
    if (!fs.existsSync(this.path)) {
      fs.mkdir(this.path);
    }
  }

  copyPackageJson(src, dst, context) {
    this.fs.copyTpl(src, dst, context);
    fs.writeFile(dst, this.fs.read(dst));
  }

  clean() {
    if (fs.existsSync(this.path)) {
      fs.removeSync(this.path);
    }
  }

  npmInstall(silent = true) {
    return this.runAsyncCommand('npm install', silent, { cwd: this.path });
  }

  yarnInstall(silent = true) {
    return this.runAsyncCommand('yarn install', silent, { cwd: this.path });
  }

  runAsyncCommand(command, silent = true, opt = {}) {
    let options = { maxBuffer: 1024 * 500, ...opt};
    return new Promise((resolve, reject) => {
      exec(command, options, (err, stdout, stderr) => {
        if (!silent) {
          console.log(stdout, stderr);
        }
      }).on('exit', (code, signal) => {
        if (!silent) {
          console.log(`Process exited with code: ${code}, signal: ${signal}`);
        }
        if (code === 0) {
          return resolve(code);
        } else {
          return reject(code);
        }
      });
    });
  }

  run(genPath, prompts) {
    let lolPath = this.path;
    return helpers.run(genPath)
      .inTmpDir(function (dir) {
        console.log(`TMP DIR: ${dir}`);
        console.log(`${lolPath}`);
        fs.ensureSymlinkSync(`${lolPath}/node_modules`, lol.join(dir, '/node_modules'))
    })
    .withPrompts(prompts)
    .toPromise();
  }

  getFs() {
    return this.fs;
  }
}

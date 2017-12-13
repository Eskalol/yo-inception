import memFs from 'mem-fs';
import FileEditor from 'mem-fs-editor';
import fs from 'fs-extra';
import { exec } from 'child_process';


export default class Inception {
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

  // eslint-disable-next-line class-methods-use-this
  symlinkAsync(target, path) {
    return new Promise((resolve, reject) => {
      fs.symlink(target, path, (err) => {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
  }

  symlinkNodeModulesAsync(path) {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(`${this.path}/node_modules`)) {
        return reject();
      }

      return resolve();
    });
  }

  npmInstall(silent = true) {
    return this.runAsyncCommand('npm install', { cwd: this.path }, silent);
  }

  yarnInstall(silent = true) {
    return this.runAsyncCommand('yarn install', { cwd: this.path }, silent);
  }

  // eslint-disable-next-line class-methods-use-this
  runAsyncCommand(command, opt = {}, silent = true, maxBuffer = 1024 * 500) {
    return new Promise((resolve, reject) => {
      exec(command, { maxBuffer, ...opt }, (err, stdout, stderr) => {
        if (!silent) {
          console.log(stdout, stderr); // eslint-disable-line no-console
        }
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
  }

  getFs() {
    return this.fs;
  }
}

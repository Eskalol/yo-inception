import memFs from 'mem-fs';
import FileEditor from 'mem-fs-editor';
import fs from 'fs';
import { exec } from 'child_process';
import File from 'vinyl';


export default class Inception {
  constructor() {
    this.fs = FileEditor.create(memFs.create());
  }

  copyPackageJson(src, dst, context) {
    this.fs.copyTpl(src, dst, context);
    fs.writeFile(dst, this.fs.read(dst));
  }

  cleanFixtures(path) {
    fs.rmdirSync(path);
  }

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

  npmInstall(path, silent = true) {
    return this.runAsyncCommand('npm install', { cwd: path }, silent);
  }

  yarnInstall(path, silent = true) {
    return this.runAsyncCommand('yarn install', { cwd: path }, silent);
  }

  runAsyncCommand(command, opt = {}, silent = true, maxBuffer = 1024 * 500) {
    return new Promise((resolve, reject) => {
      exec(command, { maxBuffer, ...opt }, (err, stdout, stderr) => {
        if (!silent) {
          console.log(stdout, stderr);
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

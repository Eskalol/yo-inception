const memFs = require('mem-fs');
const FileEditor = require('mem-fs-editor');
const fs = require('fs-extra');
const { spawn } = require('child_process');
const helpers = require('yeoman-test');
const path = require('path');
const chalk = require('chalk');

/**
 * This class provides functions to install dependencies, symlink
 * node_modules into in memory yeoman-test context and execution of commands.
 * yarn and npm is both supported
 * @type {Inception}
 */
module.exports = class Inception {
  /**
   * Creates an instance of Inception, and creates a new directory if it does not already exists.
   * @param tempDir - temporary directory,
   *                  this is where node_modules and package.json will take place.
   */
  constructor(tempDir) {
    this.fs = FileEditor.create(memFs.create());
    this.tempDir = tempDir;
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdir(this.tempDir);
    }
  }

  /**
   * Processing the `src` template file with context,
   * and stores the package.json file into `this.tempDir`
   * @param src
   * @param context
   */
  copyPackageJson(src, context) {
    const dst = path.join(this.tempDir, 'package.json');
    this.fs.copyTpl(src, dst, context);
    fs.writeFile(dst, this.fs.read(dst));
  }

  /**
   * removes temporary directory.
   */
  clean() {
    if (fs.existsSync(this.tempDir)) {
      fs.removeSync(this.tempDir);
    }
  }

  /**
   * Install dependencies into `this.tempDir` using npm
   * @param silent
   * @returns {Promise}
   */
  npmInstall(silent = true) {
    return this.runAsyncCommand('npm', ['install'], silent, { cwd: this.tempDir });
  }

  /**
   * Install dependencies into `this.tempDir` using yarn
   * @param silent - verbose?
   * @returns {Promise}
   */
  yarnInstall(silent = true) {
    return this.runAsyncCommand('yarn', ['install'], silent, { cwd: this.tempDir });
  }

  /**
   * spawns command and returns promise.
   * the promise will resolve or reject when the child process
   * has finished. It will reject when ever the exit status code is other than 0.
   * @param command - command to execute
   * @param args - command arguments
   * @param silent - verbose?
   * @param opt - object see `child_process.exec`
   * @returns {Promise}
   */
  // eslint-disable-next-line class-methods-use-this
  runAsyncCommand(command, args = [], silent = true, opt = {}) {
    return new Promise((resolve, reject) => {
      const cmd = spawn(command, args, opt);

      if (!silent) {
        cmd.stdout.on('data', (data) => {
          console.log(`${chalk.hex('#3E2F5B').bold('[yo-inception]')} ${data.toString()}`); // eslint-disable-line no-console
        });
        cmd.stderr.on('data', (data) => {
          console.log(`${chalk.hex('#E0CA3C').bold('[yo-inception stderr]')} ${data.toString()}`); // eslint-disable-line no-console
        });
      }

      cmd.on('exit', (code) => {
        if (code === 0) {
          return resolve(code);
        }
        return reject(code);
      });
    });
  }

  /**
   * Runs the yeoman-test run-context and symlinks node_modules from `this.tempDir` into the
   * in memory context.
   * @param generatorPath - path to generator
   * @param prompts - generator prompt.
   * @returns {Promise}
   */
  runGen(generatorPath, prompts) {
    return helpers.run(generatorPath)
      .inTmpDir((dir) => {
        fs.ensureSymlinkSync(`${this.tempDir}/node_modules`, path.join(dir, '/node_modules'));
      })
      .withPrompts(prompts)
      .toPromise();
  }

  getFs() {
    return this.fs;
  }
};

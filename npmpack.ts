#!/usr/bin/env node

/**
 * Command for preparing a folder as an NPM package.
 * @author Eric Crowell
 */

import yargs = require('yargs');
import * as NPMPack from './index';
import packageJson from './package.json';

/**
 * Command configuration.
 */
const command = yargs
  .options({
    root: {
      alias: 'r',
      array: true,
      describe: 'Root directory containing the package files',
      default: '.',
    },
    files: {
      alias: 'f',
      array: true,
      describe: 'Individual files to include',
      default: [],
    },
    include: {
      alias: 'i',
      array: true,
      describe: 'Glob pattern(s) of files to include',
      default: ['src/**/*.js'],
    },
    exclude: {
      alias: 'e',
      array: true,
      describe: 'Glob pattern(s) of files to exclude',
      default: [],
    },
    output: {
      alias: 'o',
      string: true,
      describe: 'Path to output matched files',
      default: 'pkg',
    },
    props: {
      alias: 'p',
      string: true,
      describe: 'JSON string to override properties in the package.json',
      default: '{}',
    }
  })
  .config()
  .version(packageJson.version);

/**
 * Get arguments as object.
 */
const argv = command.argv;

console.log('You did it:', argv);
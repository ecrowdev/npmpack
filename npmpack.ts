#!/usr/bin/env node

/**
 * Command for preparing a folder as an NPM package.
 * @author Eric Crowell
 */

import yargs = require('yargs');
import * as NPMPack from './index';
import packageJson from './package.json';

/**
 * Yargs options
 */
const yargsOptions: { [key: string]: yargs.Options } = {
	root: {
		alias: 'r',
		string: true,
		describe: 'Root directory containing the package files',
		default: '.',
	},
	copy: {
		alias: 'c',
		array: true,
		describe: 'Individual files or directories to copy',
		default: [],
	},
	include: {
		alias: 'i',
		array: true,
		describe: 'Glob pattern(s) of files to include',
		default: [],
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
		type: 'string',
		describe: 'Path to output matched files',
		default: 'pkg',
	},
	packagejson: {
		alias: 'p',
		string: true,
		array: true,
		describe: 'JSON string to override properties in the package.json',
		default: {},
	},
};

/**
 * Command configuration.
 */
const command = yargs
	.options(yargsOptions)
	.config()
	.version(packageJson.version);

/**
 * Get arguments as object.
 */
const argv = command.argv;

/**
 * Type checking
 * Mainly for the config file.
 */
function typeCheck(args: NPMPack.ObjectType): void {
	const types: { [key: string]: string } = {
		array: 'object',
		boolean: 'boolean',
		count: 'boolean',
		number: 'number',
		string: 'string',
	};
	for (const argKey in args) {
		// Skip aliases since full option argKey will be the same.
		if (argKey.length <= 1 || ['_', '$0'].includes(argKey)) {
			continue;
		}

		const arg: unknown = args[argKey];
		const opts: yargs.Options = yargsOptions[argKey];

		/**
		 * If opt is undefined, means an invalid option was passed in.
		 */
		if (!opts) {
			console.warn(`WARN: Unknown option "${argKey}" was passed in.`);
			continue;
		}

		/**
		 * Type check the passed in value.
		 */
		const foundTypes = [];
		let valid = false;
		for (const optKey in opts) {
			if (types[optKey]) {
				foundTypes.push(optKey);
				if (typeof arg === types[optKey]) {
					valid = true;
					break;
				}
			}
		}

		if (!valid) {
			console.error(`
      ERROR: Option "${argKey}" (${arg}) is not the correct type.\n
      Expected [${foundTypes.join('|')}] but got [${typeof arg}].
      `);
			process.exit(1);
		}
	}
}

/**
 * Process
 */
typeCheck(argv);

/**
 * Execute NPMPack.
 */
NPMPack.execute({
	root: argv.root as string,
	copy: argv.copy as string[],
	include: argv.include as string[],
	exclude: argv.exclude as string[],
	output: argv.output as string,
	packagejson: argv.packagejson as string | NPMPack.ObjectType,
});

/**
 * Resources for preparing an NPM Package into a workspace subfolder.
 * @module NPMPack
 * @author Eric Crowell
 */
import fs = require('fs-extra');
import p = require('path');
import glob = require('glob');

export type TObject = { [key: string]: any };

/**
 * NPM Pack options.
 */
export interface Options {
	/**
	 * Root directory containing the package files
	 */
	root?: string;
	/**
	 * Individual files or directories to copy
	 */
	copy?: string[];
	/**
	 * Glob pattern(s) of files to include
	 */
	include?: string[];
	/**
	 * Glob pattern(s) of files to exclude
	 */
	exclude?: string[];
	/**
	 * Path to output matched files
	 */
	output?: string;
	/**
	 * JSON string or JSON Object to override properties in the package.json
	 */
	packagejson?: string | TObject;
}

export interface StrictOptions {
	/**
	 * Root directory containing the package files
	 */
	root: string;
	/**
	 * Individual files or directories to copy
	 */
	copy: string[];
	/**
	 * Glob pattern(s) of files to include
	 */
	include: string[];
	/**
	 * Glob pattern(s) of files to exclude
	 */
	exclude: string[];
	/**
	 * Path to output matched files
	 */
	output: string;
	/**
	 * JSON string or JSON Object to override properties in the package.json
	 */
	packagejson: { [key: string]: any };
}

/**
 * Default options
 */
export const defaultOptions: Options = {
	root: '.',
	copy: [],
	include: [],
	exclude: [],
	output: 'pkg',
	packagejson: {},
};

/**
 * Gets and array of relative file paths from include and exclude glob patterns.
 * @param includePatterns Glob patterns of files to include
 * @param excludePatterns Glob patterns of files to exclude
 * @param noWarn Do not output warnings.
 */
export function getFilesGlob(
	includePatterns: string[],
	excludePatterns: string[],
	noWarn = false
): string[] {
	let returnFiles: string[] = [];
	includePatterns.forEach((pattern) => {
		const files = glob.sync(pattern, {
			nodir: true,
			ignore: excludePatterns,
			absolute: false,
		});
		if (!files.length) {
			!noWarn &&
				console.warn(`Warning: No files found for the pattern "${pattern}"`);
			return;
		}
		returnFiles = returnFiles.concat(files);
	});
	return returnFiles;
}

/**
 * Creates new directories if they don't exist.
 * @param path File path
 */
export function createDirectory(path: string): void {
	if (fs.existsSync(path)) {
		return;
	}
	fs.mkdirSync(path, { recursive: true });
}

/**
 * Fancy parse JSON string.
 * @param path File path
 */
export function parseJSON(json: string | TObject): TObject {
	let returnJson = json;
	if (typeof json === 'string') {
		returnJson = JSON.parse(json);
	}
	return returnJson as TObject;
}

/**
 * Copies an array of file and directory paths to a specific folder.
 * @param filesDirs The array of files and directories.
 * @param path The path to copy the files and directories to.
 */
export function copyFilesDirs(filesDirs: string[], path: string): void {
	for (let i = 0; i < filesDirs.length; i++) {
		const fileDir = filesDirs[i];

		// Ensure that the file/directory exists.
		if (!fs.existsSync(fileDir)) {
			console.warn(`WARN: ${fileDir} does not exist.`);
			continue;
		}

		const fileDirStats = fs.lstatSync(fileDir);

		if (fileDirStats.isFile() || fileDirStats.isDirectory()) {
			// Copy the template file to the new path with the new name.
			// fs.copyFileSync(`${PATH_TEMPLATES}/${file}`, fullFilePath);
			console.log('FILE!: ', fileDir);
			fs.copySync(fileDir, `${path}/${p.basename(fileDir)}`);
		}
	}
}

/**
 * The main pack execution function
 */
export function execute(options: Options = {}): void {
	/**
	 * Set default properties on any configuration that wasn't set.
	 */
	const config = {
		...defaultOptions,
		...options,
	} as StrictOptions;
	const { root, /**copy, include, exclude,*/ output } = config;
	const packagejson: TObject = parseJSON(config.packagejson);

	/**
	 * The array of all files and directories to copy.
	 */
	let filesDirs: string[] = [];

	/**
	 * Prepare the output directory.
	 */
	createDirectory(output);

	/**
	 * Read and write package.json file.
	 */
	const packageJsonPath = `${root}/package.json`;
	if (!fs.existsSync(packageJsonPath)) {
		console.error(
			`ERROR: package.json file does not exist in the root "${root}" folder.`
		);
		process.exit(1);
	}

	let packageJsonObject = {};
	const packageJsonData = fs.readFileSync(packageJsonPath).toString();
	try {
		packageJsonObject = JSON.parse(packageJsonData);
	} catch (error) {
		console.error(`${error.name}: ${error.message}`);
		process.exit(1);
	}

	const newPackageJson = {
		...packageJsonObject,
		...packagejson,
	};

	fs.writeFileSync(
		`${output}/package.json`,
		JSON.stringify(newPackageJson, null, 2)
	);

	/**
	 * Find supportive files from the root directory.
	 */
	filesDirs = filesDirs.concat(
		getFilesGlob(
			[`${root}/README*`, `${root}/LICENSE*`, `${root}/CHANGELOG*`],
			[],
			true
		)
	);

	/**
	 * Finally, copy the files and directories to the package folder.
	 */
	copyFilesDirs(filesDirs, output);
}

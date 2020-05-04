/**
 * Resources for preparing an NPM Package into a workspace subfolder.
 * @module NPMPack
 * @author Eric Crowell
 */
import fs = require('fs');
import glob = require('glob');


/**
 * NPM Pack options.
 */
export interface Options {
  /**
   * Root directory containing the package files
   */
  root: string;
  /**
   * Individual files to include
   */
  files: string[];
  /**
   * Glob pattern(s) of files to include
   */
  include: string[];
  /**
   * Glob pattern(s) of files to exclude
   */
  exclude: string;
  /**
   * Path to output matched files
   */
  output: string;
  /**
   * JSON string or JSON Object to override properties in the package.json
   */
  props: string | { [key: string]: any }
}


/**
 * Gets and array of relative file paths from include and exclude glob patterns.
 * @param includePatterns Glob patterns of files to include
 * @param excludePatterns Glob patterns of files to exclude
 */
export function getFilesGlob(
  includePatterns: string[],
  excludePatterns: string[]
) {
  let returnFiles: string[] = [];
  includePatterns.forEach((pattern) => {
    const files = glob.sync(pattern, {
      nodir: true,
      ignore: excludePatterns,
      absolute: false,
    });
    if (!files.length) {
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
export function createDirectory(path: string) {
  if (fs.existsSync(path)) {
    return;
  }
  fs.mkdirSync(path, { recursive: true });
}
/**
 * Resources for preparing an NPM Package into a workspace subfolder.
 * @module NPMPack
 * @author Eric Crowell
 */
import * as glob from 'glob';

/**
 * Configuration type.
 */
export interface Configuration {
  include: string[];
  exclude: string[];
  output: string;
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
  return [...new Set(returnFiles)];
}

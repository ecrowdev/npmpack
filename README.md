<div align="center">@eCrowJS</div>
<h1 align="center">NPM Pack</h1>

<div align="center">

[![npm package](https://img.shields.io/npm/v/@ecrowjs/npmpack/latest.svg)](https://www.npmjs.com/package/@ecrowjs/npmpack)
[![build](https://img.shields.io/travis/ecrowjs/npmpack/master)](https://travis-ci.org/github/ecrowjs/npmpack)

NPM Pack is a tool to help organize a nodejs project by organizing the deliverable files into a subfolder with it's own package.json.

</div>

# Installation

NPM Pack can be installed as an [npm package](https://www.npmjs.com/package/@ecrowjs/npmpack) itself.

```sh
# Install with NPM
npm install @ecrowjs/npmpack --save-dev
# Install with Yarn
yarn add @ecrowjs/npmpack --dev
```

It can also be installed globally.

```sh
# Global install with NPM
npm install -g @ecrowjs/npmpack
# Global install with Yarn
yarn global add @ecrowjs/npmpack
```

# Usage

NPM Pack can be interfaced on the command line or through ES2015 imports.

You can add the command to your `package.json` on the "scripts" property like so:

```json
{
    "scripts": {
        "pkg": "npmpack --copy src/**/*.js"
    }
}
```

With the addition above, you can then publish your npm package from the created sub-folder.

```sh
 $ npm run pkg # Run the script 'pkg' defined in 'package.json'
 $ cd pkg      # Navigate to the created 'pkg' folder
 $ npm publish [...your flags] # Publish your package
```


* [CLI Usage](#cli-usage)
* [Module Usage](#module-usage)

## CLI Usage

* [Flag Options](#flag-options)
* [Configuration File](#configuration-file)

```sh
$ npmpack [...flags]
```

**Example**

 Select all files under the `lib`, copy the `dist` directory, and output them under the `pkg` folder.

```sh
$ npmpack --copy lib/* dist --output pkg
```

The `pkg` folder will include all files from `lib`, the `dist` folder itself, and your core package files: `LICENSE`, `README`, `CHANGELOG`, and `package.json`.

The *output* would look something like this:

```
dist
   <...>
lib
   <...>
pkg
   dist
      <dist files...>
   <lib files...>
   CHANGLOG
   LICENSE
   README.md
   package.json
CHANGLOG
LICENSE
README.md
package.json
```

### Flag Options

| Flag           | Description                                         | Type     | Default |
|----------------|-----------------------------------------------------|----------|---------|
| --help         | Show help                                           | boolean  |         |
| --config       | Path to JSON config file                            | file     |         |
| --copy, -c, -f | Individual files or directories to include          | string[] | []      |
| --exclude, -e  | Glob pattern(s) of files to exclude                 | string[] | []      |
| --include, -i  | Glob pattern(s) of files to exclude                 | string[] | []      |
| --output, -o   | Path to output matched files                        | string   | pkg     |
| --packagejson  | JSON string to override package.json properties     | string   | "{}"    |
| --root         | The root of your project where package.json resides | string   | .       |

### Configuration File

When using the `--config` option, you can pass the path to a json file that contains the options you want to pass in.

**Example**:

```sh
$ npmpack --config npmpack.json
```

`npmpack.json`
```json
{
    "root": ".",
    "copy": ["dist"],
    "include": ["lib/**/*.ts"],
    "exclude": ["lib/**/*.test.ts"],
    "packagejson": {
        "name": "Changed Package Name",
        "version": "<some_other_version>"
    }
}
```

## Module Usage

NPM Pack can also be included as a module for one of your custom build scripts.

```javascript
// CommonJS
const NPMPack = require('@ecrowjs/npmpack');
// ES6
import * as NPMPack from '@ecrowjs/npmpack');

// Execute NPMPack with some optional configuration.
NPMPack.execute({
    root: ".",
    copy: ["dist"],
    include: ["lib/**/*.ts"],
    exclude: ["lib/**/*.test.ts"],
    packagejson: {
        "name": "Changed Package Name",
        "version": "<some_other_version>"
    }
})
```

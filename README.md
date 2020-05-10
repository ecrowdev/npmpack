<div align="center">@eCrowJS</div>
<h1 align="center">NPM Pack</h1>

<div align="center">

[![npm package](https://img.shields.io/npm/v/@ecrowjs/npmpack/latest.svg)](https://www.npmjs.com/package/@ecrowjs/npmpack)
[![build](https://img.shields.io/travis/ecrowjs/npmpack/master)](https://travis-ci.org/github/ecrowjs/npmpack)

NPM Pack is a tool to help organize a nodejs project by packing the deliverable files into a subfolder with it's own package.json.

</div>

## Installation

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

## Usage

NPM Pack can be interfaced on the command line or through ES2015 imports.

### CLI Usage

```sh
$ npmpack [...flags]
```

Example: Select all files under the `lib`, copy the `dist` directory, and output them under the `pkg` folder.

```sh
npmpack --copy lib/* dist --output pkg
```

The `pkg` folder will include all files from `lib`, the `dist` folder itself, and your core package files: `LICENSE`, `README`, `CHANGELOG`, and `package.json`.

```
|__dist
|__|__<...>
|___lib
|___|___<...>
|___pkg
|__|__dist
|__|__|__<dist files...>
|__|__<lib files...>
|__|__CHANGLOG
|__|__LICENSE
|__|__README.md
|__|__package.json
|__CHANGLOG
|__LICENSE
|__README.md
|__package.json
```

#### Flag Options

| Flag           | Description                                         | Type     | Default |
|----------------|-----------------------------------------------------|----------|---------|
| --help         | Show help                                           | boolean  |         |
| --config       | Path to JSON config file                            | file     |         |
| --copy, -c, -f | Individual files or directories to include          | string[] | []      |
| --exclude      | Glob pattern(s) of files to exclude                 | string[] | []      |
| --include      | Glob pattern(s) of files to exclude                 | string[] | []      |
| --output       | Path to output matched files                        | string   | pkg     |
| --packagejson  | JSON string to override package.json properties     | string   | "{}"    |
| --root         | The root of your project where package.json resides | string   | .       |

#### JSON Configuration File

When using the `--config` option, you can pass the path to a json file that contains the options you want to pass in.

For example:

```sh
npmpack --config npmpack.json
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
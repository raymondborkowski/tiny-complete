# tiny-complete
[![NPM](https://nodei.co/npm/tiny-complete.png)](https://nodei.co/npm/tiny-complete/)

[![NPM version](https://img.shields.io/npm/v/tiny-complete.svg?style=flat-square)](https://www.npmjs.com/package/tiny-complete)
[![dependencies](https://david-dm.org/raymondborkowski/tiny-complete.svg)](https://david-dm.org/raymondborkowski/tiny-complete)
[![Build](https://travis-ci.org/raymondborkowski/tiny-complete.svg?branch=master)](https://travis-ci.org/raymondborkowski/tiny-complete)
[![codecov.io](https://codecov.io/github/raymondborkowski/tiny-complete/coverage.svg?branch=master)](https://codecov.io/github/raymondborkowski/tiny-complete?branch=master)
[![gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/tiny-complete?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![devDependencies](https://david-dm.org/raymondborkowski/tiny-complete/dev-status.svg)](https://david-dm.org/raymondborkowski/tiny-complete#info=devDependencies)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fraymondborkowski%2Ftiny-complete.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fraymondborkowski%2Ftiny-complete?ref=badge_shield)
[![downloads](https://img.shields.io/npm/dt/tiny-complete.svg)](https://img.shields.io/npm/dt/tiny-complete.svg)

*Lightweight, dependency free type-ahead/autocomplete solution!*

[View Demo](https://raymondborkowski.github.io/tiny-complete/index.html)
![](./docs/example.png)

## Install
`npm i tiny-complete --save`
## Use

In Javascript:<br>
```js
new TinyComplete({
    element: '#element_id'
});
```

## Benchmarking Size (`npm package-size`):
|Typeahead Packages  | minified  |  Gzipped |
| ------------- | ------------- | ------------- |
| tiny-complete  | 3.31kB |1.43kB|

## Developing and contributing to tiny-complete
### Folder structure
The main body of code is in `index.js`

The tests are in the `spec/unit` directory. Please follow naming convention with `xxxx.spec.js`

### Running tests

We use [Jasmine](https://jasmine.github.io/api/3.0/global) The existing tests are in the spec folder.

Please write tests for new additions. We use codecov to test for complete unit test coverage.

#### Run all the tests:

`npm test`

### Before submitting a pull request

Please make sure all code supports all versions of node. We write code in ES5 syntax for smaller size and browser compatibility.

We use ESLint for syntax consistency, and the linting rules are included in this repository. Running `npm test` will check the linting rules as well. Please make sure your code has no linting errors before submitting a pull request.

`npm run lint_fix` will also automatically fix any linting errors.

## License

[MIT](https://github.com/raymondborkowski/tiny-complete/blob/master/LICENSE)


[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fraymondborkowski%2Ftiny-complete.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fraymondborkowski%2Ftiny-complete?ref=badge_large)
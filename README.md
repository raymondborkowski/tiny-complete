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

[View Demo](https://raymondborkowski.github.io/tiny-complete/index.html) <br>
![](./docs/example.png)

## Install
`npm i tiny-complete --save`
## Use
HTML
* It is important to position the parent element rather than the input so the dropdown container knows where to position itself.

```html
<div class="tiny-complete">
    <input id="cities" type="text" name="search" placeholder="Enter your search term">
    <input id="cities2" type="text" name="search2" placeholder="Enter your search term">
</div>
```
Example of using array values for default values
```js
TC = new TinyComplete({
    id: 'city',
    defaultVals: ['LA','Miami','Detroit','NYC','NYC'],
    onInput: onInputArray, // Callback will have (filteredValues, query_user_inputed)
    onSelect: function(val) { console.log(val); },
    maxResults: 15, // Defaults to 10
});
```
// Example of using objects. Please set object using KV pairs
```js
TC2 = new TinyComplete({
    id: 'city2',
    defaultVals: [{key: 'DTW', val: 'Detroit (DTW)'}, {key: 'LAX', val: 'LA'}, {key: 'MIA', val: 'Miami'}, {key: 'NYC', val: 'NYC'}, {key: 'LAX', val: 'LAMP'}],
    onInput: onInputObject,
    onSelect: function(val, key) { console.log(val, key); },
    maxResults: 15,  // Defaults to 10
});
```
Example onInput helpers that fetch new results and add them based on what the user inputs.
```js
var TC, TC2;
function onInputArray(filteredVals, query) {
    if (query.length > 2 && filteredVals.length < 5) {
        fetch('https://yourUrlHere.com/?q=' + query)
            .then(function (response) {
                return response.json();
            })
            .then(function(response) {
                TC.addValues(response.results.map(function(record) { return record.value }));
            });
    }
}

function onInputObject(filteredVals, query) {
    if (query.length > 2 && Object.keys(filteredVals).length < 5) {
        fetch('https://yourUrlHere.com/?q=' + query)
            .then(function (response) {
                return response.json();
            })
            .then(function(response) {
                TC2.addValues(response.results.map(function(record) { return {key: record.key, val: record.value} }));
            });
    }
}
```

## Publicly exposed methods
- `TinyComplete.addValues(array_of_objects_or_strings)` - This will allow you to add new values dynamically to a cache of options
- `onInput(filteredVals, query)` - On input callback will be executed with the filtered list that the user sees and the query that the user entered
- `onSelect(val, key)` - On Select of an option from dropdown list, the callback will be executed with value of the input box, and key (if passed in)

## Benchmarking Size (`npm package-size`):
|Typeahead Packages  | minified  |  Gzipped |
| ------------- | ------------- | ------------- |
| tiny-complete  | 1.99 KB |925 B|   

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
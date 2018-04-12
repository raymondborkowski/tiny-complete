const FeatherTest = require('feather-test');

const myTests = new FeatherTest({
    specs: './specs'
});

myTests.run();

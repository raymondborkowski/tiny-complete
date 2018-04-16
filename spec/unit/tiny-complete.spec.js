var jsdom = require('jsdom');
var { JSDOM } = jsdom;
var { window } = new JSDOM('<!DOCTYPE html>');
var $ = require('jQuery')(window);
var TinyComplete = require('../../index');

describe('TinyComplete', function () {
    $('<input id="jokes" type="text" name="jokes" placeholder="Enter your joke term">').appendTo('body');
    global.window = window;
    global.document = window.window;

    var TC = new TinyComplete({
        id: 'jokes',
        arrVals: ['ray', 'hi', 'detroit', 'nyc'],
        onChange: function (tinyCompareObject) {
            console.log(tinyCompareObject);
        },
        maxResults: 15
    });

    describe('InitialState', function () {
        it('initial state hides results', function () {
            expect($('autocomplete-items-container').is(':visible')).not.toBe(true);
        });

        it('sets proper starting arr', function () {
            expect(TC.arrVals).toEqual(['ray', 'hi', 'detroit', 'nyc']);
        });

        it('sets proper starting master list', function () {
            expect(TC.masterList).toEqual(['ray', 'hi', 'detroit', 'nyc']);
        });

        it('sets empty string for start query', function () {
            expect(TC.query).toBe('');
        });
    });
});

var jsdom = require('jsdom');
var { JSDOM } = jsdom;
var { window } = new JSDOM('<!DOCTYPE html><head></head><body><p>Hello world</p></body>');
var $ = require('jQuery')(window);
var TinyComplete = require('../../index');

describe('TinyComplete', function () {
    $('<input id="jokes" type="text" class="jokes" name="jokes" placeholder="Enter your joke term">Ray</input>').appendTo('body');
    global.window = window;
    global.document = window.document;


    var TC = new TinyComplete({
        id: 'jokes',
        arrVals: ['ray', 'hi', 'detroit', 'nyc'],
        onChange: function (tinyCompareObject) {
            console.log(tinyCompareObject);
        },
        maxResults: 2
    });

    describe('InitialState', function () {
        it('element is on page', function () {
            expect($('input').hasClass('jokes')).toBe(true);
        });

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

    describe('KeyPress', function() {
        $( "#jokes" ).keypress();

        // it('initial state hides results', function () {
        //     console.log($('#jokes').val());
        // });
    });
});

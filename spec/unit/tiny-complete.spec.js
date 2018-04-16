var TinyComplete = require('../../index');
var JSDOM = require('jsdom').JSDOM;
var dom = new JSDOM('<!DOCTYPE html><input id="jokes" type="text" class="jokes" name="jokes" placeholder="Enter your joke term">', { pretendToBeVisual: true });
global.window = dom.window;
global.document = dom.window.document;
global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

describe('TinyComplete', function () {
    function getInputEl() {
        return window.document.querySelector('#jokes');
    }

    function addInput(keyCode, value) {
        const event = new window.KeyboardEvent( 'keyup', { keyCode: keyCode } );
        getInputEl().setAttribute('value', value);
        getInputEl().dispatchEvent(event);
    }

    var TC;
    beforeEach(function () {
        TC = new TinyComplete({
            id: 'jokes',
            arrVals: ['ray', 'hi', 'detroit', 'nyc'],
            onChange: function () {
                getInputEl().setAttribute('cats', 'bobo');
            },
            maxResults: 15
        });
    });

    describe('InitialState', function () {
        it('initial state hides results', function () {
            expect(window.document.querySelector('.autocomplete-items-container')).toEqual(null);
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

    describe('Input', function () {
        it('filters down based on r keypress', function () {
            addInput(82, 'r');

            expect(TC.arrVals).toEqual(['ray', 'detroit']);
        });

        it('sets cat to bobo onchange', function () {
            addInput(82, 'r');

            expect(getInputEl().getAttribute('cats')).toEqual('bobo');
        });

        describe('delete button hit', function () {
            it('removes letter in TC.query when backspace is hit', function () {
                addInput(82, 'r');
                var originalQuery = TC.query;
                addInput(46, '');

                expect(originalQuery).not.toEqual(TC.query);
                expect(TC.query).toEqual('');
            });

            it('removes previously applied filter to array', function () {
                addInput('82', 'ray');

                expect(TC.arrVals).toEqual(['ray']);

                addInput(46, '');

                expect(TC.arrVals.sort()).toEqual(['ray', 'hi', 'detroit', 'nyc'].sort());
            });
        });
    });

    describe('properly exports', function () {
        it('exports to module', function () {
            expect(module.children[0].exports).toBe(TinyComplete);
        });
    });

    describe('show results', function () {
        it('shows the results on click', function () {

        });
    });

    describe('Nuke', function () {
        it('properly returns a request', function () {
            TC.nuke();
        });
    });

    describe('Request', function () {
        it('properly returns a request', function (done) {
            TC.request('https://api.chucknorris.io/jokes/search?query=california', function (response) {
                expect(JSON.parse(response).total).toEqual(11);
                done();
            });
        });
    });
});

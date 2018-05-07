var TinyComplete = require('../../index');
var JSDOM = require('jsdom').JSDOM;
var dom = new JSDOM('<!DOCTYPE html><body><input id="jokes" type="text" class="jokes" name="jokes" placeholder="Enter your joke term" /><input id="dumby" type="text" /></body>', { pretendToBeVisual: true });
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
            defaultVals: ['ray', 'hi', 'detroit', 'nyc'],
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
            expect(TC.defaultVals).toEqual(['ray', 'hi', 'detroit', 'nyc']);
        });

        it('sets proper starting master list', function () {
            expect(TC.masterList).toEqual(['ray', 'hi', 'detroit', 'nyc']);
        });

        it('sets empty string for start query', function () {
            expect(TC.query).toBe('');
        });

        describe('Handles no valid options', function () {
            it('console errs msg', function () {
                spyOn(console, 'error');
                TC = new TinyComplete();

                expect(console.error).toHaveBeenCalledWith('Plz pass options into TinyComplete'); // eslint-disable-line no-console
            });
        });
    });

    describe('Input', function () {
        it('filters down based on r keypress', function () {
            addInput(82, 'r');

            expect(TC.defaultVals).toEqual(['ray', 'detroit']);
        });

        it('defaults to show 10 if no max results', function () {
            TC = new TinyComplete({
                id: 'jokes',
                defaultVals: ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9', 'r10', 'r11', 'r12'],
                onChange: function () {
                    getInputEl().setAttribute('cats', 'bobo');
                }
            });
            addInput(82, 'r');
            var lengthOfItems = document.querySelectorAll('#autocomplete-items-container option').length;

            expect(lengthOfItems).toBe(10);
        });

        it('sets cat to bobo onchange', function () {
            addInput(82, 'r');

            expect(getInputEl().getAttribute('cats')).toEqual('bobo');
        });

        // TODO: Make this test fail tests if it throwa an err
        it('does not error out if no onchange is provided', function () {
            TC = new TinyComplete({
                id: 'jokes',
                defaultVals: ['dumb'],
                maxResults: 1
            });
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

                expect(TC.defaultVals).toEqual(['ray']);

                addInput(46, '');

                expect(TC.defaultVals.sort()).toEqual(['ray', 'hi', 'detroit', 'nyc'].sort());
            });
        });
    });

    describe('properly exports', function () {
        it('exports to module', function () {
            expect(module.children[0].exports).toBe(TinyComplete);
        });
    });

    describe('properly shows and hides list based on focus', function () {
        it('shows the results on focus of box', function () {
            addInput(82, 'r');
            document.getElementById('jokes').focus();
            var display = document.getElementById('autocomplete-items-container').style.display;

            expect(display).toBe('block');
        });

        it('hides the results on blur of box', function () {
            addInput(82, 'r');
            document.getElementById('jokes').focus();
            document.getElementById('jokes').blur();

            expect(document.getElementById('autocomplete-items-container').style.display).toBe('none');
        });
    });

    describe('Nuke', function () {
        it('properly nukes instance of TC', function () {
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

    describe('helpers', function () {
        it('dedupes arrays', function () {
            TC = new TinyComplete({
                id: 'jokes',
                defaultVals: ['ray', 'hi', 'detroit', 'nyc', 'nyc']
            });

            expect(TC.masterList).toEqual(['ray', 'hi', 'detroit', 'nyc']);
        });

        it('dedupes objects', function () {
            TC = new TinyComplete({
                id: 'jokes',
                defaultVals: [{key: '1', val: 'dog'}, {key: '2', val: 'cat'}, {key: '3', val: 'pig'}, {key: '1', val: 'dog'}]
            });

            expect(TC.masterList).toEqual([{key: '1', val: 'dog'}, {key: '2', val: 'cat'}, {key: '3', val: 'pig'}]);
        });
    });
});

var TinyComplete = require('../../index');
var JSDOM = require('jsdom').JSDOM;

describe('TinyComplete', function () {
    var TC;
    jasmine.clock().install();
    function getInputEl() {
        return window.document.getElementById('jokes');
    }

    function addInput(keyCode, value) {
        var event = new window.KeyboardEvent( 'keyup', { keyCode: keyCode } );
        var inputEl = getInputEl();
        inputEl.setAttribute('value', value);
        inputEl.innerText = value;
        inputEl.dispatchEvent(event);
    }

    function clickOnEl(el) {
        var evt = document.createEvent('HTMLEvents');
        evt.initEvent('click', false, true);
        el.dispatchEvent(evt);
    }

    beforeEach(function () {
        var dom = new JSDOM('<!DOCTYPE html><body><input id="dumby1" type="text" /><input id="jokes" type="text" class="jokes" name="jokes" placeholder="Enter your joke term" /><div></div></body>', { pretendToBeVisual: true });
        global.window = dom.window;
        global.document = dom.window.document;
        global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
        TC = new TinyComplete({
            id: 'jokes',
            defaultVals: ['ray', 'hi', 'detroit', 'nyc'],
            onInput: function () {
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
        it('filters down Arrays based on r keypress', function () {
            addInput(82, 'r');

            expect(TC.defaultVals).toEqual(['ray', 'detroit']);
        });

        it('filters down object based on r keypress', function () {
            TC = new TinyComplete({
                id: 'jokes',
                defaultVals: [{key: '1', val: 'dog'}, {key: '2', val: 'cat'}, {key: '3', val: 'pig'}, {key: '4', val: 'rooster'}]
            });

            addInput(82, 'r');

            expect(TC.defaultVals).toEqual({0: {key: '4', val: 'rooster'}});
        });

        it('defaults to show 10 if no max results', function () {
            TC = new TinyComplete({
                id: 'jokes',
                defaultVals: ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9', 'r10', 'r11', 'r12'],
                onInput: function () {
                    getInputEl().setAttribute('cats', 'bobo');
                }
            });
            addInput(82, 'r');
            var lengthOfItems = document.querySelectorAll('.autocomplete-items-container p').length;

            expect(lengthOfItems).toBe(10);
        });

        it('sets cat to bobo onchange', function () {
            addInput(82, 'r');

            expect(getInputEl().getAttribute('cats')).toEqual('bobo');
        });

        // TODO: Make this test fail tests if it throws an err
        it('does not error out if no onchange is provided', function () {
            TC = new TinyComplete({
                id: 'jokes',
                defaultVals: ['dumb'],
                maxResults: 1
            });
        });

        it('Adds key element to option if an object', function () {
            TC = new TinyComplete({
                id: 'jokes',
                defaultVals: [{key: '1', val: 'dog'}, {key: '2', val: 'cat'}, {key: '3', val: 'rooster'}, {key: '1', val: 'dog'}]
            });

            addInput(82, 'r');

            expect(document.getElementsByClassName('autocomplete-options')[0].getAttribute('key')).toBe('3');
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

    describe('properly shows and hides list of options', function () {
        it('shows the results on focus', function () {
            addInput(82, 'r');
            document.getElementById('jokes').focus();
            jasmine.clock().tick(400);
            var display = document.querySelector('.autocomplete-items-container').style.display;

            expect(display).toBe('block');
        });

        it('hides the results on focus of another element', function () {
            addInput(82, 'r');
            getInputEl().focus();
            document.getElementById('dumby1').focus();
            jasmine.clock().tick(800);

            expect(document.querySelector('.autocomplete-items-container').style.display).toBe('none');
        });

        it('keeps the result if input box still has focus', function () {
            addInput(82, 'r');
            document.getElementById('jokes').focus();
            jasmine.clock().tick(800);
            clickOnEl(document);

            expect(document.querySelector('.autocomplete-items-container').style.display).toBe('block');
        });
    });

    describe('click of option', function () {
        it('hides the results on click of option', function () {
            addInput(82, 'r');
            document.getElementById('jokes').focus();
            jasmine.clock().tick(400);
            clickOnEl(document.querySelector('.autocomplete-items-container'));
            document.body.focus();
            jasmine.clock().tick(400);

            expect(document.querySelector('.autocomplete-items-container').style.display).toBe('none');
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

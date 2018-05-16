var TinyComplete = require('../../index');
var JSDOM = require('jsdom').JSDOM;

describe('TinyComplete', function () {
    var TC;
    jasmine.clock().install();
    function getInputEl() {
        return window.document.getElementById('jokes');
    }

    function addInput(keyCode, value, overrideEl) {
        var event = new window.Event('input');
        var inputEl = overrideEl || getInputEl();
        inputEl.focus();
        inputEl.setAttribute('value', value);
        inputEl.innerText = value;
        inputEl.dispatchEvent(event);
        return event;
    }

    function keyEvent(keyCode) {
        var event = new window.KeyboardEvent( 'keydown', { keyCode: keyCode } );
        var inputEl = getInputEl();
        inputEl.dispatchEvent(event);
    }

    function clickOnEl(el) {
        var evt = document.createEvent('HTMLEvents');
        evt.initEvent('click', false, true);
        el.dispatchEvent(evt);
    }

    beforeEach(function () {
        var dom = new JSDOM('<!DOCTYPE html><body><input id="dumby1" type="text" /><input id="jokes" type="text" name="jokes" placeholder="Enter your joke term" /><div></div></body>', { pretendToBeVisual: true });
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

        xit('sets proper starting arr', function () {
            expect(TC._defaultVals).toEqual(['ray', 'hi', 'detroit', 'nyc']);
        });

        xit('sets proper starting master list', function () {
            expect(TC._masterList).toEqual(['ray', 'hi', 'detroit', 'nyc']);
        });

        xit('sets empty string for start query', function () {
            expect(TC._query).toBe('');
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
        xit('filters down Arrays based on r keypress', function () {
            addInput(82, 'r');

            expect(TC._defaultVals).toEqual(['ray', 'detroit']);
        });

        xit('filters down object based on r keypress', function () {
            TC = new TinyComplete({
                id: 'jokes',
                defaultVals: [{key: '1', val: 'dog'}, {key: '2', val: 'cat'}, {key: '3', val: 'pig'}, {key: '4', val: 'rooster'}]
            });

            addInput(82, 'r');

            expect(TC._defaultVals).toEqual({0: {key: '4', val: 'rooster'}});
        });

        xit('defaults to show 10 if no max results', function () {
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

        xit('sets cat to bobo onchange', function () {
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

        xit('Adds key element to option if an object', function () {
            TC = new TinyComplete({
                id: 'jokes',
                defaultVals: [{key: '1', val: 'dog'}, {key: '2', val: 'cat'}, {key: '3', val: 'rooster'}, {key: '1', val: 'dog'}]
            });

            addInput(82, 'r');

            expect(document.getElementsByClassName('autocomplete-options')[0].getAttribute('key')).toBe('3');
        });

        describe('delete button hit', function () {
            xit('removes letter in TC.query when backspace is hit', function () {
                addInput(82, 'r');
                var originalQuery = TC._query;
                addInput(46, '');

                expect(originalQuery).not.toEqual(TC._query);
                expect(TC._query).toEqual('');
            });

            xit('removes previously applied filter to array', function () {
                addInput('82', 'ray');

                expect(TC._defaultVals).toEqual(['ray']);

                addInput(46, '');

                expect(TC._defaultVals.sort()).toEqual(['ray', 'hi', 'detroit', 'nyc'].sort());
            });
        });
    });

    describe('properly exports', function () {
        it('exports to module', function () {
            expect(module.children[0].exports).toBe(TinyComplete);
        });
    });

    describe('properly shows and hides list of options', function () {
        xit('shows the results on focus', function () {
            addInput(82, 'r');
            document.getElementById('jokes').focus();
            jasmine.clock().tick(400);
            var display = document.querySelector('.autocomplete-items-container').style.display;

            expect(display).toBe('block');
        });

        xit('hides the results on focus of another element', function () {
            addInput(82, 'r');
            getInputEl().focus();
            document.getElementById('dumby1').focus();
            jasmine.clock().tick(800);

            expect(document.querySelector('.autocomplete-items-container').style.display).toBe('none');
        });

        xit('keeps the result if input box still has focus', function () {
            addInput(82, 'r');
            document.getElementById('jokes').focus();
            jasmine.clock().tick(800);
            clickOnEl(document);

            expect(document.querySelector('.autocomplete-items-container').style.display).toBe('block');
        });
    });

    describe('click of option', function () {
        xit('hides the results on click of option', function () {
            document.getElementById('jokes').focus();
            addInput(82, 'r');
            jasmine.clock().tick(400);
            clickOnEl(document.querySelector('.autocomplete-items-container'));
            document.body.focus();
            jasmine.clock().tick(400);

            expect(document.querySelector('.autocomplete-items-container').style.display).toBe('none');
        });

        xit('navigates through list and highlights ray', function () {
            addInput(82, 'r');
            document.getElementById('jokes').focus();
            jasmine.clock().tick(400);
            keyEvent(40);

            expect(document.querySelectorAll('.autocomplete-hover').length).toBe(1);
            expect(document.querySelectorAll('.autocomplete-hover')[0].className).toBe('autocomplete-options autocomplete-hover');
            expect(document.querySelectorAll('.autocomplete-hover')[0].innerHTML).toBe('ray');
        });

        xit('navigates through list twice and highlights ray', function () {
            addInput(82, 'r');
            document.getElementById('jokes').focus();
            jasmine.clock().tick(400);
            keyEvent(40);
            keyEvent(40);
            keyEvent(40);

            expect(document.querySelectorAll('.autocomplete-hover').length).toBe(1);
            expect(document.querySelectorAll('.autocomplete-hover')[0].className).toBe('autocomplete-options autocomplete-hover');
            expect(document.querySelectorAll('.autocomplete-hover')[0].innerHTML).toBe('ray');
        });

        xit('navigates backwards', function () {
            addInput(82, 'r');
            jasmine.clock().tick(400);
            keyEvent(38);

            expect(document.querySelectorAll('.autocomplete-hover').length).toBe(1);
            expect(document.querySelectorAll('.autocomplete-hover')[0].className).toBe('autocomplete-options autocomplete-hover');
            expect(document.querySelectorAll('.autocomplete-hover')[0].innerHTML).toBe('detroit');
        });

        xit('navigates through list and backwards', function () {
            addInput(82, 'r');
            document.getElementById('jokes').focus();
            jasmine.clock().tick(400);
            keyEvent(40);
            keyEvent(40);

            expect(document.querySelectorAll('.autocomplete-hover')[0].innerHTML).toBe('detroit');
            expect(document.querySelectorAll('.autocomplete-hover')[0].className).toBe('autocomplete-options autocomplete-hover');

            keyEvent(38);

            expect(document.querySelectorAll('.autocomplete-hover')[0].innerHTML).toBe('ray');
            expect(document.querySelectorAll('.autocomplete-hover')[0].className).toBe('autocomplete-options autocomplete-hover');
        });

        it('navigates through list and hits enter', function () {
            addInput(82, 'r');
            document.getElementById('jokes').focus();
            jasmine.clock().tick(400);
            keyEvent(40);
            keyEvent(13);

            expect(document.getElementById('jokes').innerText).toBe('r');
        });

        it('does nothing', function () {
            addInput(82, 'r');
            document.getElementById('jokes').focus();
            jasmine.clock().tick(400);
            keyEvent(13);

            expect(document.getElementById('jokes').innerText).toBe('r');
        });
    });

    describe('Nuke', function () {
        it('properly nukes instance of TC', function () {
            TC.nuke();
        });
    });

    describe('helpers', function () {
        xit('dedupes arrays', function () {
            TC = new TinyComplete({
                id: 'jokes',
                defaultVals: ['ray', 'hi', 'detroit', 'nyc', 'nyc']
            });

            expect(TC._masterList).toEqual(['ray', 'hi', 'detroit', 'nyc']);
        });

        xit('dedupes objects', function () {
            TC = new TinyComplete({
                id: 'jokes',
                defaultVals: [{key: '1', val: 'dog'}, {key: '2', val: 'cat'}, {key: '3', val: 'pig'}, {key: '1', val: 'dog'}]
            });

            expect(TC._masterList).toEqual([{key: '1', val: 'dog'}, {key: '2', val: 'cat'}, {key: '3', val: 'pig'}]);
        });
    });
});

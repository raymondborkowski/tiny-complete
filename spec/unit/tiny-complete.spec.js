var TinyComplete = require('../../index');
var JSDOM = require('jsdom').JSDOM;

describe('TinyComplete', function () {
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

    function resetDOM() {
        var dom = new JSDOM('<!DOCTYPE html><body><input id="dumby1" type="text" /><input id="jokes" type="text" name="jokes" placeholder="Enter your joke term" /><div></div></body>', { pretendToBeVisual: true });
        global.window = dom.window;
        global.document = dom.window.document;
        global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
    }

    beforeEach(function () {
        resetDOM();
        new TinyComplete({
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

        describe('Handles no valid options', function () {
            it('console errs msg', function () {
                spyOn(console, 'error');
                TC = new TinyComplete();

                expect(console.error).toHaveBeenCalledWith('Plz pass options into TinyComplete'); // eslint-disable-line no-console
            });
        });
    });

    describe('Input', function () {
        // TODO: Make this test fail tests if it throws an err
        it('does not error out if no onchange is provided', function () {
            TC = new TinyComplete({
                id: 'jokes',
                defaultVals: ['dumb'],
                maxResults: 1
            });
        });

        describe('delete button hit', function () {
        });
    });

    describe('properly shows and hides list of options', function () {
    });

    describe('click of option', function () {
        it('navigates through list and hits enter', function () {
            addInput(82, 'r');
            document.getElementById('jokes').focus();
            jasmine.clock().tick(400);
            keyEvent(40);
            keyEvent(13);

            expect(document.getElementById('jokes').innerText).toBe('r');
        });

        xit('does nothing', function () {
            addInput(82, 'r');
            document.getElementById('jokes').focus();
            jasmine.clock().tick(400);
            keyEvent(13);

            expect(document.getElementById('jokes').innerText).toBe('r');
        });
    });

    describe('Nuke', function () {

    });

    describe('dedupes', function () {

    });

    describe('properly exports', function () {
        it('exports to module', function () {
            expect(module.children[0].exports).toBe(TinyComplete);
        });
    });
});

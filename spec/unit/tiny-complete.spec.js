var TinyComplete = require('../../index');
var JSDOM = require('jsdom').JSDOM;

describe('TinyComplete', function () {
    jasmine.clock().install();

    function getInputEl() {
        return window.document.getElementById('jokes');
    }

    // function addInput(keyCode, value, overrideEl) {
    //     var event = new window.Event('input');
    //     var inputEl = overrideEl || getInputEl();
    //     inputEl.focus();
    //     inputEl.setAttribute('value', value);
    //     inputEl.innerText = value;
    //     inputEl.dispatchEvent(event);
    //     return event;
    // }
    //
    // function keyEvent(keyCode) {
    //     var event = new window.KeyboardEvent( 'keydown', { keyCode: keyCode } );
    //     var inputEl = getInputEl();
    //     inputEl.dispatchEvent(event);
    // }
    //
    // function clickOnEl(el) {
    //     var evt = document.createEvent('HTMLEvents');
    //     evt.initEvent('click', false, true);
    //     el.dispatchEvent(evt);
    // }

    function resetDOM() {
        var dom = new JSDOM('<!DOCTYPE html><body><input id="dumby1" type="text" /><input id="jokes" type="text" name="jokes" placeholder="Enter your joke term" /><div></div></body>', { pretendToBeVisual: true });
        global.window = dom.window;
        global.document = dom.window.document;
        global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
    }

    beforeEach(function () {
        resetDOM();
        var TC = new TinyComplete({
            id: 'jokes',
            defaultVals: ['ray', 'hi', 'detroit', 'nyc'],
            onInput: function () {
                getInputEl().setAttribute('cats', 'bobo');
                TC.addValues(['rocky']);
            },
            maxResults: 15
        });
    });

    describe('InitialState', function () {
        describe('Handles no valid options', function () {
        });
    });

    describe('Input', function () {
        describe('delete button hit', function () {
        });
    });

    describe('properly shows and hides list of options', function () {
    });

    describe('click of option', function () {
    });

    describe('Ads to List', function () {

    });

    describe('dedupes', function () {

    });

    describe('properly exports', function () {
        it('exports to module', function () {
            expect(module.children[0].exports).toBe(TinyComplete);
        });
    });
});

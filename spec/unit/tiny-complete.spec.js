var TinyComplete = require('../../index');
var JSDOM = require('jsdom').JSDOM;

describe('TinyComplete', function () {
    jasmine.clock().install();
    var TC;

    function getInputEl() {
        return window.document.getElementById('jokes');
    }

    function getDropDownEl() {
        return window.document.querySelector('.tc-contain');
    }

    function keyEvent(keyCode, inputEl) {
        var event = new window.KeyboardEvent( 'keydown', { keyCode: keyCode } );
        inputEl.dispatchEvent(event);
        jasmine.clock().tick(400);
    }

    function addInput(keyCode, value, overrideEl) {
        var event = new window.Event('input');
        var inputEl = overrideEl || getInputEl();
        inputEl.focus();
        inputEl.setAttribute('value', value);
        inputEl.innerText = value;
        inputEl.dispatchEvent(event);
        keyEvent(keyCode, inputEl);
    }

    function clickOnEl(el, bubbles) {
        bubbles = bubbles || false;
        var evt = document.createEvent('HTMLEvents');
        evt.initEvent('click', bubbles, true);
        el.dispatchEvent(evt);
        el.focus();
        jasmine.clock().tick(4000);
    }

    function mouseover(el){
        var ev = document.createEvent('MouseEvent');
        ev.initMouseEvent(
            'mouseover',
            true /* bubble */, true /* cancelable */,
            window, null,
            0, 0, 0, 0, /* coordinates */
            false, false, false, false, /* modifier keys */
            0 /* left*/, null
        );
        el.dispatchEvent(ev);
    }

    function resetDOM(dom) {
        dom = dom || new JSDOM('<!DOCTYPE html><body><input id="dumby1" type="text" /><input id="jokes" type="text" name="jokes" placeholder="Enter your joke term" /><div></div></body>');
        global.window = dom.window;
        global.document = dom.window.document;
        global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
    }

    beforeEach(function () {
        resetDOM();
        TC = new TinyComplete({
            id: 'jokes',
            listItems: ['Rockford', 'New York', 'Miami', 'rockford'],
            onUserInput: function () {
                TC.addListItems(['Rockland', 'Raleigh']);
            }
        });
    });

    describe('InitialState - ', function () {
        it('TC to be falsy if no options passed in', function () {
            TC = new TinyComplete();

            expect(TC.addListItems).toBeUndefined();
        });

        it('does nothing if navigating no list', function () {
            var inputEl = getInputEl();
            document.getElementById('jokes').focus();
            jasmine.clock().tick(800);
            keyEvent(40, inputEl);

            expect(document.getElementById('tc-hover')).toBe(null);
        });
    });

    describe('Dropdown - ', function () {
        beforeEach(function () {
            addInput(82, 'r');
            document.getElementById('jokes').focus();
            jasmine.clock().tick(800);
        });

        it('shows the dropdown list of options', function () {
            var display = getDropDownEl().style.display;

            expect(display).toBe('block');
        });

        it('hides the dropdown list of options', function () {
            var display = getDropDownEl().style.display;

            expect(display).toBe('block');

            var dumby1 = document.getElementById('dumby1');
            clickOnEl(dumby1);
            display = getDropDownEl().style.display;

            expect(display).toBe('none');
        });

        it('has the correct class on dropdown', function () {
            var classArr = getDropDownEl().classList;

            expect(classArr[0]).toEqual('tc-contain');
            expect(classArr[1]).toEqual('tc-jokes');
        });

        it('contains the correct values', function () {
            var options = getDropDownEl().children;
            var innerTxt = [];
            for (var i = 0; i < options.length; i++) {
                innerTxt.push(options[i].innerHTML);
            }

            expect(options.length).toEqual(3);
            expect(innerTxt).toEqual(['Rockford', 'New York', 'rockford']);
        });

        xit('contains the correct values after onUserInput is called', function () {
            addInput(65, 'a');
            document.getElementById('jokes').focus();
            jasmine.clock().tick(800);

            var options = getDropDownEl().children;
            var innerTxt = [];
            for (var i = 0; i < options.length; i++) {
                innerTxt.push(options[i].innerHTML);
            }

            expect(options.length).toEqual(3);
            expect(innerTxt).toEqual(['Miami', 'Rockland', 'Raleigh']);
        });

        xit('shows a max of ten values by defaults', function () {
            TC = new TinyComplete({
                id: 'jokes',
                listItems: ['Rockford', 'New York', 'Miami', 'rockford', 'Rockford1', 'New York1', 'Miami1', 'rockford1', 'Rockford2', 'New York2', 'Miami2', 'rockford2'],
                onUserInput: function () {
                    TC.addListItems(['Rockland', 'Raleigh']);
                }
            });
            addInput(82, 'r');
            document.getElementById('jokes').focus();
            jasmine.clock().tick(800);
            var options = getDropDownEl().children;

            expect(options.length).toEqual(10);
        });

        xit('shows a max of what user sets for values length', function () {
            TC = new TinyComplete({
                id: 'jokes',
                listItems: ['Rockford', 'New York', 'Miami', 'rockford', 'Rockford1', 'New York1', 'Miami1', 'rockford1', 'Rockford2', 'New York2', 'Miami2', 'rockford2', 'Rockford3', 'New York3', 'Miami3', 'rockford3'],
                onUserInput: function () {
                    TC.addListItems(['Rockland', 'Raleigh']);
                },
                maxResults: 11
            });
            addInput(82, 'r');
            document.getElementById('jokes').focus();
            jasmine.clock().tick(800);
            var options = getDropDownEl().children;

            expect(options.length).toEqual(11);
        });
    });

    describe('click of option with no sibling - ', function () {
        beforeEach(function () {
            resetDOM(new JSDOM('<!DOCTYPE html><body><input id="jokes" type="text" name="jokes" placeholder="Enter your joke term" /></body>'));
            TC = new TinyComplete({
                id: 'jokes',
                listItems: [{key: 'DTW', val: 'Detroit (DTW)'}, {key: 'LAX', val: 'LA'}, {key: 'MIA', val: 'Miami'}, {key: 'NYC', val: 'NYC'}, {key: 'LAX', val: 'LAMP'}],
                onUserInput: function () {
                    TC.addListItems(['Rockland', 'Raleigh']);
                },
                maxResults: 15
            });
            addInput(82, 'r');
            document.getElementById('jokes').focus();
            jasmine.clock().tick(800);
        });

        it('properly sets value of input box based on click', function () {
            var inputEl = getInputEl();
            var firstOption = getDropDownEl().children[0];
            clickOnEl(firstOption, true);

            expect(inputEl.value).toBe('Detroit (DTW)');
        });
    });

    describe('dedupes - ', function () {
        beforeEach(function () {
            addInput(82, 'r');
            document.getElementById('jokes').focus();
            jasmine.clock().tick(800);
        });

        it('dedupes the values of Arrays', function () {
            var options = getDropDownEl().children;
            var innerTxt = [];
            for (var i = 0; i < options.length; i++) {
                innerTxt.push(options[i].innerHTML);
            }

            expect(options.length).toEqual(3);
            expect(innerTxt).toEqual(['Rockford', 'New York', 'rockford']);
        });
    });

    describe('navigating through the list - ', function () {
        beforeEach(function () {
            addInput(82, 'r');
            document.getElementById('jokes').focus();
            jasmine.clock().tick(800);
        });

        it('navigates through list and highlights Rockford', function () {
            var inputEl = getInputEl();
            keyEvent(40, inputEl);

            expect(document.querySelectorAll('#tc-hover').length).toBe(1);
            expect(document.querySelectorAll('#tc-hover')[0].innerHTML).toBe('Rockford');
        });

        it('navigates backwards to bottom of list', function () {
            var inputEl = getInputEl();
            keyEvent(38, inputEl);

            expect(document.querySelectorAll('#tc-hover').length).toBe(1);
            expect(document.querySelectorAll('#tc-hover')[0].innerHTML).toBe('rockford');
        });

        it('navigates top to bottom and through bottom back to top', function () {
            var inputEl = getInputEl();
            keyEvent(40, inputEl);
            keyEvent(40, inputEl);
            keyEvent(40, inputEl);
            keyEvent(40, inputEl);

            expect(document.querySelectorAll('#tc-hover').length).toBe(1);
            expect(document.querySelectorAll('#tc-hover')[0].innerHTML).toBe('Rockford');
        });

        it('navigates through list and highlights Rockford and hits enter', function () {
            var inputEl = getInputEl();
            keyEvent(40, inputEl);
            keyEvent(13, inputEl);

            expect(document.querySelectorAll('#tc-hover').length).toBe(1);
            expect(document.querySelectorAll('#tc-hover')[0].innerHTML).toBe('Rockford');
        });
    });

    describe('properly exports', function () {
        it('exports to module', function () {
            expect(module.children[0].exports).toBe(TinyComplete);
        });
    });

    describe('adds class on mouseOver', function () {
        it('adds class on mouseOver', function () {
            addInput(82, 'r');
            document.getElementById('jokes').focus();
            jasmine.clock().tick(800);
            var firstChild = getDropDownEl();
            mouseover(firstChild);

            expect(firstChild.id).toContain('tc-hover');
        });
    });
});

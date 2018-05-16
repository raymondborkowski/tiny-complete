/*
 *
 * List Manipulations
 *
 */

function filterResults(list, query) {
    return list.filter(function (record) { return (record.val || record).toLowerCase().indexOf(query.toLowerCase()) !== -1 && record; });
}

function dedupe(list) {
    return list.filter(function (item, index, array) {
        return item.key ? array.map(function (mapItem){ return mapItem.val; }).indexOf(item.val) === index : array.indexOf(item) === index;
    });
}

/*
 *
 * Listeners
 *
 */

function listContainerListeners(el, listContainer, options) {
    listContainer.addEventListener('click', function (e) {
        setKVofInputEl(el, e.target, options.onClick || function () {});
        listContainerDisplay(listContainer, 'none');
    });

    listContainer.addEventListener('mouseover', function (e) {
        addActiveClass(e.target);
    });

    el.addEventListener('blur', function () {
        listContainerDisplay(listContainer, 'none');
    });

    el.addEventListener('focus', function () {
        listContainerDisplay(listContainer, 'block');
    });
}

/*
 *
 * DOM Changes
 *
 */

function positionListNearInput(parent, el) {
    var parentStyles = parent.getBoundingClientRect();
    el.style.cssText = 'min-width:' + parentStyles.width + 'px;left:' + parentStyles.left + 'px;';
}

function setKVofInputEl(inputEl, elClicked, cb) {
    var val = elClicked.innerText;
    var key = elClicked.getAttribute('key');
    inputEl.value = val;
    inputEl.setAttribute('key', key);
    cb(val, key);
}

function listContainerDisplay(el, displayStyle) {
    setTimeout(function () { el.style.display = displayStyle; }, 200);
}

// TODO: Cleanup
function addDropDownHTML(el, vals, options) {
    var parentNode = el.parentNode;
    var maxResults = options.maxResults || 10;
    var shownVals = vals;
    var listContainer = document.createElement('div');

    if (el.nextSibling.classList && el.nextSibling.classList.contains(options.id)) {
        parentNode.removeChild(el.nextSibling);
    }
    listContainer.setAttribute('class', 'autocomplete-items-container');
    listContainer.classList.add(options.id);
    el.insertAdjacentElement('afterend', listContainer);
    positionListNearInput(el, listContainer);
    for (var i = 0; (i < shownVals.length || i < Object.keys(shownVals).length) && i < maxResults; i++) {
        var choice = document.createElement('p');
        choice.setAttribute('class', 'autocomplete-options');
        choice.innerHTML = shownVals[i].val || shownVals[i];
        choice.setAttribute('key', shownVals[i].key);
        listContainer.appendChild(choice);
    }

    listContainerListeners(el, listContainer, options);
}

// TODO: Cleanup
function removeHoverClass() {
    var highlightedSelector = 'autocomplete-hover';
    var highlightedElement = document.getElementsByClassName(highlightedSelector)[0];
    highlightedElement && highlightedElement.classList.remove(highlightedSelector);
}

function addActiveClass(el) {
    removeHoverClass();
    el.classList.add('autocomplete-hover');
}

// TODO: Cleanup
function highlightFocusedOption(options, indexOfCurrentOption) {
    // Allow for going over and under in list
    var lengthOfOptions = options.length;
    if (indexOfCurrentOption >= lengthOfOptions)  {
        indexOfCurrentOption = 0;
    } else if (indexOfCurrentOption < 0) {
        indexOfCurrentOption = lengthOfOptions - 1;
    }

    addActiveClass(options[indexOfCurrentOption]);
    return indexOfCurrentOption;
}

// TODO: Cleanup
function navigateListListener(inputEl, id) {
    var indexOfCurrentOption = 0;
    inputEl.addEventListener('keydown', function (e) {
        var options = (document.querySelector('.' + id) || {}).children;
        var keycode = e.keyCode;
        if (options) {
            if (keycode === 40) {
                indexOfCurrentOption++;
                indexOfCurrentOption = highlightFocusedOption(options, indexOfCurrentOption);
            } else if (keycode === 38) {
                indexOfCurrentOption--;
                indexOfCurrentOption = highlightFocusedOption(options, indexOfCurrentOption);
            } else if (keycode === 13) {
                options[indexOfCurrentOption].click();
            }
        }
    });
}

/*
 *
 * Internals
 *
 */

// TODO: Cleanup
function TinyComplete(options) {
    if (typeof options !== 'object') return console.error('Plz pass options into TinyComplete');  // eslint-disable-line no-console
    var masterList = dedupe(options.defaultVals);
    var userSearchQuery = '';
    var valuesToShow = masterList;

    function bindings(_this) {
        var inputEl = window.document.getElementById(options.id);
        inputEl.addEventListener('input', function () {
            userSearchQuery = this.value;
            valuesToShow = filterResults(masterList, userSearchQuery);
            addDropDownHTML.call(_this, inputEl, valuesToShow, options);
            options.onInput ? options.onInput(valuesToShow, userSearchQuery) : /* istanbul ignore next */ function () {};
        });
        navigateListListener(inputEl, options.id);
    }

    bindings(this);
    this.addValues = function (vals) { masterList = dedupe(masterList.concat(vals));};
    this.nuke = function () {};
}

(function () {
    /* istanbul ignore next  */
    if (typeof exports === 'object') {
        module.exports = TinyComplete;
    } else if (typeof define === 'function' && define.amd) {
        window.define(TinyComplete);
    } else {
        window.TinyComplete = TinyComplete;
    }
}.call(this));

/*
 *
 * List Manipulations
 *
 */

function filterResults(list, query) {
    return list.filter(function (record) {
        return (record.val || record).toLowerCase().indexOf(query.toLowerCase()) !== -1 && record;
    });
}

function dedupe(list) {
    return list.filter(function (item, index, array) {
        return item.key ? array.map(function (mapItem) {
            return mapItem.val;
        }).indexOf(item.val) === index : array.indexOf(item) === index;
    });
}

/*
     *
     * Listeners
     *
     */

function listContainerListeners(el, listContainer, onSelect) {
    listContainer.addEventListener('click', function (e) {
        setKVofInputEl(el, e.target, onSelect || function () {
        });
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
    setTimeout(function () {
        el.style.display = displayStyle;
    }, 200);
}

function addDropDownHTML(el, vals, options) {
    // Remove old dropdown list
    var siblingEl = el.nextSibling;
    if (siblingEl.classList && siblingEl.classList.contains('tc-' + options.id)) {
        el.parentNode.removeChild(siblingEl);
    }

    // Create new list
    var listContainer = document.createElement('div');
    listContainer.setAttribute('class', 'tc-contain tc-' + options.id);
    el.insertAdjacentElement('afterend', listContainer);
    positionListNearInput(el, listContainer);

    vals.forEach(function (value) {
        var choiceOption = document.createElement('p');
        choiceOption.innerHTML = value.val || value;
        choiceOption.setAttribute('key', value.key);
        listContainer.appendChild(choiceOption);
    });

    listContainerListeners(el, listContainer, options.onSelect);
}

function addActiveClass(el) {
    // Remove old hover class
    var currentHoveredEl = document.getElementById('tc-hover');
    currentHoveredEl && currentHoveredEl.removeAttribute('id');

    el.setAttribute('id', 'tc-hover');
}

function highlightFocusedOption(options, indexOfCurrentOption) {
    // Allow for going over and under in list
    var lengthOfOptions = options.length;
    if (indexOfCurrentOption >= lengthOfOptions) {
        indexOfCurrentOption = 0;g
    } else if (indexOfCurrentOption < 0) {
        indexOfCurrentOption = lengthOfOptions - 1;
    }

    addActiveClass(options[indexOfCurrentOption]);
    return indexOfCurrentOption;
}

function navigateListListener(inputEl, id) {
    var indexOfCurrentOption = -1;
    inputEl.addEventListener('keydown', function (e) {
        var options = (document.querySelector('.tc-' + id) || {}).children;
        var keycode = e.keyCode;
        if (options) {
            if (keycode === 40) {
                indexOfCurrentOption++;
                indexOfCurrentOption = highlightFocusedOption(options, indexOfCurrentOption);
            } else if (keycode === 38) {
                indexOfCurrentOption--;
                indexOfCurrentOption = highlightFocusedOption(options, indexOfCurrentOption);
            } else if (keycode === 13) {
                indexOfCurrentOption > 0 && options[indexOfCurrentOption].click();
            }
        }
    });
}

/*
     *
     * Internals
     *
     */

function TinyComplete(options) {
    function bindings() {
        var inputEl = document.getElementById(options.id);
        inputEl.addEventListener('input', function () {
            userSearchQuery = this.value;
            valuesToShow = filterResults(masterList, userSearchQuery);
            addDropDownHTML(inputEl, valuesToShow, options);
            options.onInput ? options.onInput(valuesToShow, userSearchQuery) : /* istanbul ignore next */ function () {
            };
        });
        navigateListListener(inputEl, options.id);
    }

    if (typeof options !== 'object') return;
    var masterList = dedupe(options.defaultVals);
    var valuesToShow = masterList;
    var userSearchQuery = '';

    bindings(this);

    this.addValues = function (vals) {
        masterList = dedupe(masterList.concat(vals));
    };
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

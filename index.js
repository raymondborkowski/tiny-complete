/**
 * @TinyComplete a lightweight, dependency free autocomplete
 **/

(function () {
    // List Manipulations

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

    // Listeners

    function listContainerListeners(inputEl, listContainer, onSelect) {
        listContainer.addEventListener('click', function (e) {
            setKVofInputEl(inputEl, e.target, onSelect || function () {});
            listContainerDisplay(listContainer, 'none');
        });

        listContainer.addEventListener('mouseover', function (e) {
            addActiveClass(e.target);
        });

        inputEl.addEventListener('blur', function () {
            listContainerDisplay(listContainer, 'none');
        });

        inputEl.addEventListener('focus', function () {
            listContainerDisplay(listContainer, 'block');
        });
    }

    // DOM Changes

    function setWidth(parent, el) {
        el.style.minWidth = parent.offsetWidth + 'px';
    }

    function setKVofInputEl(inputEl, elClicked, cb) {
        var val = elClicked.innerHTML;
        var key = elClicked.getAttribute('key');
        inputEl.value = val;
        inputEl.setAttribute('key', key);
        cb(val, key);
    }

    function listContainerDisplay(listContainerEl, displayStyle) {
        setTimeout(function () {
            listContainerEl.style.display = displayStyle;
        }, 10);
    }

    function addDropDownHTML(inputEl, vals, options) {
        var siblingEl = inputEl.nextSibling || null;
        var parentEl = inputEl.parentNode;
        var listContainer = document.createElement('div');

        listContainer.setAttribute('class', 'tc-contain tc-' + options.id);
        if (siblingEl) {
            parentEl.insertBefore(listContainer, siblingEl);
            if (siblingEl.classList && siblingEl.classList.contains('tc-' + options.id)) {
                parentEl.removeChild(siblingEl);
            }
        } else {
            parentEl.appendChild(listContainer);
        }

        setWidth(inputEl, listContainer);

        vals.forEach(function (value, index) {
            if (index < (options.maxResults || 10)){
                var choiceOption = document.createElement('li');
                choiceOption.innerHTML = value.val || value;
                choiceOption.setAttribute('key', value.key);
                choiceOption.setAttribute('class', 'tc-li');
                listContainer.appendChild(choiceOption);
            }
        });

        listContainerListeners(inputEl, listContainer, options.onSelect);
    }

    function addActiveClass(el) {
        // Remove old hover class
        var currentHoveredEl = document.getElementById('tc-hover');
        currentHoveredEl && currentHoveredEl.removeAttribute('id');

        el && el.setAttribute('id', 'tc-hover');
    }

    function highlightFocusedOption(options, indexOfCurrentOption) {
        // Allow for going over and under in list
        options = options || [];
        var lengthOfOptions = options.length;
        if (indexOfCurrentOption >= lengthOfOptions) {
            indexOfCurrentOption = 0;
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
            if (keycode === 40) {
                indexOfCurrentOption = highlightFocusedOption(options, indexOfCurrentOption += 1);
            } else if (keycode === 38) {
                indexOfCurrentOption = highlightFocusedOption(options, indexOfCurrentOption -= 1);
            } else if (keycode === 13) {
                indexOfCurrentOption >= 0 && options.length > 0 && options[indexOfCurrentOption].click();
            }
        });
    }

    // Internals

    function TinyComplete(options) {
        if (typeof options !== 'object') return;
        var masterList = dedupe(options.listItems);
        var valuesToShow = masterList;
        var userSearchQuery = '';

        bindings();

        this.addListItems = function (vals) {
            masterList = dedupe(masterList.concat(vals));
        };

        function bindings() {
            var inputEl = document.getElementById(options.id);
            inputEl.addEventListener('input', function (e) {
                userSearchQuery = e.target.value;
                valuesToShow = filterResults(masterList, userSearchQuery);
                addDropDownHTML(inputEl, valuesToShow, options);
                options.onUserInput ? options.onUserInput(valuesToShow, userSearchQuery) : /* istanbul ignore next */ function () {
                };
            });
            navigateListListener(inputEl, options.id);
        }
    }

    /* istanbul ignore next  */
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = TinyComplete;
    } else if (typeof window.define === 'function' && define.amd) {
        window.define(TinyComplete);
    } else {
        window.TinyComplete = TinyComplete;
    }
}());

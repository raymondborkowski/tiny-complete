function filterObject(obj, predicate) {
    var result = {};
    var key;
    var i = 0;
    for (key in obj) {
        if (obj.hasOwnProperty(key) && predicate(obj[key])) {
            result[i] = obj[key];
            i++;
        }
    }

    return result;
}

function filterArr(list, predicate) {
    return list.filter(function (record) {
        if (predicate(record)) {
            return record;
        }
    });
}

function filterResults(list, query) {
    if (typeof list[0] === 'string') {
        return filterArr(list, function (result) {
            return result.toLowerCase().indexOf(query.toLowerCase()) !== -1;
        });
    }
    return filterObject(list, function (result) {
        return result.val.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    });
}

function positionElXAxis(parent, el) {
    var parentStyles = parent.getBoundingClientRect();
    el.style.left = parentStyles.left + 'px';
    el.style.minWidth = parentStyles.width + 'px';
}

function dedupe(list, i) {
    if (typeof list[0] === 'string') {
        var listLength = list.length;
        while (i = --listLength) while (i--)list[listLength] !== list[i] || list.splice(i, 1); // eslint-disable-line no-cond-assign
        return list;
    }
    return list.filter(function (item, pos, array){
        return array.map(function (mapItem){ return mapItem.val; }).indexOf(item.val) === pos;
    });
}

function handleClick(inputEl, elClicked, cb) {
    var val = elClicked.innerText;
    var key = elClicked.getAttribute('key');
    inputEl.value = val;
    inputEl.setAttribute('key', key);
    cb(val, key);
}

function listeners(el, listContainer, options) {
    listContainer.addEventListener('click', function (e) {
        handleClick(el, e.target, options.onClick || function () {});
        listContainer.style.display = 'none';
    });

    document.addEventListener('click', function (e) {
        if (el !== document.activeElement && e.target.parentNode !== listContainer) {
            listContainer.style.display = 'none';
        }
    });

    el.addEventListener('focus', function () {
        listContainer.style.display = 'block';
    });
}

function addDropDownHTML(el, options) {
    var _this = this;
    var parentNode = el.parentNode;
    var maxResults = options.maxResults || 10;
    parentNode.children.length > 1 && parentNode.removeChild(parentNode.lastChild);
    var listContainer = document.createElement('div');
    listContainer.setAttribute('id', 'autocomplete-items-container');
    parentNode.appendChild(listContainer);
    positionElXAxis(el, listContainer);
    for (var i = 0; (i < _this.defaultVals.length || i < Object.keys(_this.defaultVals).length) && i < maxResults; i++) {
        var choice = document.createElement('p');
        choice.setAttribute('class', 'autocomplete-options');
        choice.innerHTML = _this.defaultVals[i].val || _this.defaultVals[i];
        choice.setAttribute('key',  _this.defaultVals[i].key);
        listContainer.appendChild(choice);
    }

    listeners(el, listContainer, options);
}

function bindToInput(options) {
    var _this = this;
    var inputEl = window.document.getElementById(options.id);
    inputEl.addEventListener('keyup', function () {
        _this.masterList = dedupe(_this.masterList);
        _this.query = this.value;
        _this.defaultVals = filterResults(_this.masterList, _this.query);
        addDropDownHTML.call(_this, inputEl, options);
        options.onChange ? options.onChange(_this) : /* istanbul ignore next */ function () {};
    });
}

function TinyComplete(options) {
    if (typeof options !== 'object') return console.error('Plz pass options into TinyComplete');  // eslint-disable-line no-console
    this.masterList = dedupe(options.defaultVals);
    this.defaultVals = this.masterList;
    this.query = '';
    bindToInput.call(this, options);
}

TinyComplete.prototype.nuke = function () {};

TinyComplete.prototype.request = function (url, cb) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            cb(xmlHttp.responseText);
        }
    };
    xmlHttp.open('GET', url, true);
    xmlHttp.send(null);
};

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

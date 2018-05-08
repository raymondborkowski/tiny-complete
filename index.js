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
    el.style.left = parent.getBoundingClientRect().left + 'px';
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

function addDropDownHTML(el, maxResults) {
    var _this = this;
    var parentNode = el.parentNode;
    parentNode.children.length > 1 && parentNode.removeChild(parentNode.lastChild);
    var listContainer = document.createElement('div');
    listContainer.setAttribute('id', 'autocomplete-items-container');
    parentNode.appendChild(listContainer);
    positionElXAxis(el, listContainer);
    for (var i = 0; (i < _this.defaultVals.length || i < Object.keys(_this.defaultVals).length) && i < maxResults; i++) {
        var option = document.createElement('option');
        option.setAttribute('class', 'autocomplete-options');
        option.innerHTML = _this.defaultVals[i].val || _this.defaultVals[i];
        option.setAttribute('key',  _this.defaultVals[i].key);
        listContainer.appendChild(option);
    }

    listeners(el, listContainer);
}

function listeners(el, listContainer) {
    el.addEventListener('blur', function () {
        listContainer.style.display = 'none';
    });

    el.addEventListener('focus', function () {
        listContainer.style.display = 'block';
    });
}

function bindToInput(el, cb, options) {
    var _this = this;
    el.addEventListener('keyup', function () {
        _this.masterList = dedupe(_this.masterList);
        _this.query = this.value;
        var maxResults = options.maxResults || 10;
        _this.defaultVals = filterResults(_this.masterList, _this.query, maxResults);
        addDropDownHTML.call(_this, el, maxResults);
        cb(_this);
    });
}

function TinyComplete(options) {
    if (typeof options !== 'object') return console.error('Plz pass options into TinyComplete');  // eslint-disable-line no-console
    var inputEl = window.document.getElementById(options.id);
    this.masterList = dedupe(options.defaultVals);
    this.defaultVals = this.masterList;
    this.query = '';
    bindToInput.call(this, inputEl, function (_this) {
        options.onChange = options.onChange || function () /* istanbul ignore next: TODO: test this */ {};
        options.onChange(_this);
    }, options);
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

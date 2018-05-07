function filterResults(arr, query, maxResults) {
    var i = 0;
    return arr.filter(function (record) {
        if (i < maxResults && record.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
            i++;
            return record;
        }
    });
}

function dedupe(a, b, c) {
    b = a.length;
    while (c = --b) while (c--)a[b] !== a[c] || a.splice(c, 1); // eslint-disable-line no-cond-assign
    return a;
}

function addDropDownHTML(el, maxResults) {
    var _this = this;
    var parentNode = el.parentNode;
    parentNode.children.length > 1 && parentNode.removeChild(parentNode.lastChild);
    var listContainer = document.createElement('div');
    listContainer.setAttribute('id', 'autocomplete-items-container');
    parentNode.appendChild(listContainer);
    for (var i = 0; i < _this.defaultVals.length && i < maxResults; i++) {
        var b = document.createElement('div');
        b.innerHTML = _this.defaultVals[i];
        listContainer.appendChild(b);
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
        _this.masterList = dedupe(_this.masterList.concat(_this.defaultVals));
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
    this.masterList = options.defaultVals;
    this.defaultVals = options.defaultVals;
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

function filterResults(arr, query, maxResults) {
    var i = 0;
    return arr.filter(function (record) {
        return record.toLowerCase().indexOf(query.toLowerCase()) !== -1 && i < maxResults && i++ && record;
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
    var a = document.createElement('div');
    a.setAttribute('id', 'autocomplete-items-container');
    parentNode.appendChild(a);
    for (var i = 0; i < _this.arrVals.length && i < maxResults; i++) {
        var b = document.createElement('div');
        b.innerHTML = _this.arrVals[i];
        a.appendChild(b);
    }

    listeners(el, a);
}

function listeners(el, a) {
    el.addEventListener('blur', function () {
        a.style.display = 'none';
    });

    el.addEventListener('focus', function () {
        a.style.display = 'block';
    });
}

function bindToInput(el, cb, options) {
    var _this = this;
    el.addEventListener('keypress', function () {
        console.log('hi');
        _this.masterList = dedupe(_this.masterList.concat(_this.arrVals));
        _this.query = this.value;
        _this.arrVals = filterResults(_this.masterList, _this.query, options.maxResults);
        addDropDownHTML.call(_this, el, options.maxResults);
        if (typeof cb === 'function') {
            cb(_this);
        }
    });
}

function TinyComplete(options) {
    options = options || {};
    var inputEl = window.document.getElementById(options.id);
    this.masterList = options.arrVals;
    this.arrVals = options.arrVals;
    this.query = '';
    bindToInput.call(this, inputEl, function (_this) {
        options.onChange(_this);
    }, options);
}

TinyComplete.prototype.nuke = function () {
    console.log('Going to destroy everything here');
};

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


if (typeof module !== 'undefined' && module.exports) {
    module.exports = TinyComplete;
} else {
    window.autoComplete = TinyComplete;
}

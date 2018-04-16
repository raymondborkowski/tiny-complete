function filterResults(arr, query) {
    return arr.filter(function (record) { return record.toLowerCase().indexOf(query.toLowerCase()) !== -1; });
}

function wasDeleteButton(key) {
    return key === 8 || key === 46;
}


function dedupe(a, b, c) {
    b = a.length;
    while (c = --b) while (c--)a[b] !== a[c] || a.splice(c, 1); // eslint-disable-line no-cond-assign
    return a;
}

function addDropDownHTML(_this, el) {
    var parentNode = el.parentNode;
    parentNode.children.length > 1 && parentNode.removeChild(parentNode.lastChild);
    var a = document.createElement('DIV');
    a.setAttribute('class', 'autocomplete-items');
    parentNode.appendChild(a);
    for (var i = 0; i < _this.arrVals.length; i++) {
        var b = document.createElement('DIV');
        b.innerHTML = '<span>' + _this.arrVals[i] + '</span>';
        a.appendChild(b);
    }
}

function bindToInput(el, cb) {
    var _this = this;
    el.addEventListener('keyup', function (e) {
        _this.masterList = dedupe(_this.masterList.concat(_this.arrVals));
        var vals = wasDeleteButton(e.keyCode) ? _this.masterList : _this.arrVals;
        _this.query = this.value;
        _this.arrVals = filterResults(vals, _this.query);
        addDropDownHTML(_this, el);
        if (typeof cb === 'function') {
            cb(_this);
        }
    });
}

function TinyComplete(_options) {
    var options = _options || {};
    var inputEl = document.getElementById(options.id);
    this.masterList = options.arrVals;
    this.arrVals = options.arrVals;
    bindToInput.call(this, inputEl, function (_this) {
        options.onChange(_this);
    });
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

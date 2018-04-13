function request(url, cb) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {cb(xmlHttp.responseText);}
    };
    xmlHttp.open('GET', url, true);
    xmlHttp.send(null);
}

function createUrlEncodedString(val) {
    return encodeURIComponent(val);
}

function bindToInput(el, cb) {
    el.addEventListener('input', function (e) {
        cb(createUrlEncodedString(e.srcElement.value));
    });
}

function TinyComplete(_options) {
    var options = _options || {};
    var inputEl = document.getElementById(options.id);

    options.setArrVals(request, createUrlEncodedString(inputEl.value)); // Request for initial value
    bindToInput(inputEl, function (query) {
        if (typeof options.setArrVals === 'function') {
            options.setArrVals(request, query);
        }
    });
}

TinyComplete.prototype.nuke = function () {};


if (typeof module !== 'undefined' && module.exports) {
    module.exports = TinyComplete;
} else {
    window.autoComplete = TinyComplete;
}

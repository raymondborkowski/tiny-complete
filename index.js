function TinyComplete() {
    // var arrOfVals = ['detroit', 'nyc', 'grand rapids'];
    console.log('hello');
}

TinyComplete.prototype.nuke = function () {
    console.log('nuked');
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TinyComplete;
} else {
    window.autoComplete = TinyComplete;
}

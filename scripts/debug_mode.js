class DebugMode {
    ifDebug(action) {
        action();
    }
}

module.exports = new DebugMode();
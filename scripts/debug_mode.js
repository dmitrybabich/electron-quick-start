class DebugMode {
    ifDebug(action) {
        return;
        action();
    }
}

module.exports = new DebugMode();
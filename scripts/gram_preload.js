const {ipcRenderer} = require('electron');

var textHelper = new function () {
    var self = this;
    self.setText = function (text) {
        var area = document.getElementById("textarea");
        area.value = text;
    }

    self.getText = function (text) {
        var area = document.getElementById("textarea");
        ipcRenderer.sendToHost("apply-text", area.value);
    }
};

window.textHelper = textHelper;
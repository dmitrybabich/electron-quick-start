const TabGroup = require("electron-tabs");
// const dragula = require("dragula");
const filesystem = require('fs');
const fixedTabs = require("./scripts/fixed_tabs.js");
const iscTabs = require("./scripts/isc_tabs.js");
const downloader = require("./scripts/downloader.js");
const {actionProcessor} = require("./scripts/action_processor.js");
const path = require('path');
const Combokeys = require("combokeys");
var shortcuts = new Combokeys(document.documentElement);
const {snackbar} = require('./scripts/ui.js');
var ipcRenderer = require('electron').ipcRenderer;



shortcuts.bind('ctrl+shift+d', function () {
    snackbar.showText("DevTools");
    var tab = tabGroup.getActiveTab();
    var vw = tab.webview;
    vw.openDevTools();
});

shortcuts.bind('ctrl+w', function () {
    snackbar.showText("Close tab");
    var tab = tabGroup.getActiveTab();
    tab.close();
});

var registerISCActionShortcut = function (keys, text, actionName) {
    shortcuts.bind(keys, function () {
        snackbar.showText(text);
        var tab = tabGroup.getActiveTab();
        actionProcessor.processAction(actionName, tab.ticketId)
    });
}

registerISCActionShortcut('ctrl+shift+c', "Copy Path", 'copy-path');
registerISCActionShortcut('ctrl+shift+o', "Open folder", "open-folder");
registerISCActionShortcut('ctrl+shift+t', "Template Projects", "create-project");
registerISCActionShortcut('ctrl+shift+z', "ZIP Project", "archive-project");

iscTabs.subscribe((actionName, ticketId, webview) => {
    actionProcessor.processAction(actionName, ticketId, webview);
});
var ticketCss = filesystem.readFileSync("./stat_patchers/isc_ticket.css");

var tabGroup = new TabGroup();

tabGroup.on("tab-removed", (tab, tabGroup) => { tab.ticketId = null; });
tabGroup.on("tab-active", (tab, tabGroup) => {
    setTimeout(function () {
        ipcRenderer.send('active-tab-changed', tab.ticketId);
    }, 1000);
});

tabGroup.on("tab-added", (tab, tg) => {
    let webview = tab.webview;
    webview.addEventListener('new-window', (e) => {
        var downloadMatches = downloader.checkDonwloadLink(e.url);
        if (downloadMatches)
            webview.getWebContents().downloadURL(e.url);
        else
            iscTabs.checkNeedOpen(tabGroup, e);
    });
});
var e = {};
e.url = "https://isc.devexpress.com/Thread/WorkplaceDetails?id=T473370";
iscTabs.checkNeedOpen(tabGroup, e);

fixedTabs.init(tabGroup);




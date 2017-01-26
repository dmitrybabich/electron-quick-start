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
var electron = require('electron');
var ipcRenderer = electron.ipcRenderer;
var shell = electron.shell;
const clipboard = electron.clipboard;



shortcuts.bind('ctrl+shift+d', function () {
    snackbar.showText("DevTools");
    var tab = tabGroup.getActiveTab();
    var vw = tab.webview;
    vw.openDevTools();
});


shortcuts.bind('ctrl+shift+r', function () {
    snackbar.showText("Reload");
    var tab = tabGroup.getActiveTab();
    var vw = tab.webview;
    vw.reload();
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


iscTabs.subscribe((actionName, ticketId, webview, data, tabItem) => {
    actionProcessor.processAction(actionName, ticketId, webview, data, tabItem);
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



    var func = (url) => {
        var downloadMatches = downloader.checkDonwloadLink(url);
        if (downloadMatches)
            webview.getWebContents().downloadURL(url);
        else {
            if (!iscTabs.checkNeedOpen(tabGroup, url)) {
                shell.openExternal(url);
            }
        }
    };
    webview.addEventListener('new-window', (e) => {
        func(e.url);
    });
    // webview.addEventListener('will-navigate', (e) => {
    //     webview.stop();
    //     func(e.url);
    //     webview.stop();
    // });
    tab.tab.setAttribute("style", "-webkit-app-region: no-drag;");
});
//iscTabs.checkNeedOpen(tabGroup, "https://isc.devexpress.com/Thread/WorkplaceDetails?id=T416406");

fixedTabs.init(tabGroup);


var tabGroupElement = document.getElementsByClassName('etabs-tabgroup');
tabGroupElement[0].setAttribute("style", "-webkit-app-region: drag;");

shortcuts.bind('alt+shift+q', function () {
    var ticketID = clipboard.readText();
    if (ticketID && ticketID.length <= 7) {
        snackbar.showText('Opening ticket ' + ticketID);
        iscTabs.checkNeedOpen(tabGroup, "https://isc.devexpress.com/Thread/WorkplaceDetails?id=" + ticketID);
    }
});

const TabGroup = require("electron-tabs");
// const dragula = require("dragula");
const filesystem = require('fs');
const fixedTabs = require("./scripts/fixed_tabs.js");
const iscTabs = require("./scripts/isc_tabs.js");

const downloader = require("./scripts/downloader.js");
const gramHelper = require("./scripts/gram_helper");
const {actionProcessor} = require("./scripts/action_processor.js");
const path = require('path');
const Combokeys = require("combokeys");
var shortcuts = new Combokeys(document.documentElement);
const {snackbar} = require('./scripts/ui.js');
var electron = require('electron');
var ipcRenderer = electron.ipcRenderer;
var shell = electron.shell;
const clipboard = electron.clipboard;
const searchInPage = require('electron-in-page-search').default;


gramHelper.setWebView(document.getElementById("full-screen-edit"));
gramHelper.setCloseButton(document.getElementById("close-checker-button"))



shortcuts.bind('ctrl+shift+d', function () {
    snackbar.showText("DevTools");
    var tab = tabGroup.getActiveTab();
    var vw = tab.webview;
    vw.openDevTools();
});

shortcuts.bind('ctrl+f', function () {
    snackbar.showText("Search");
    var tab = tabGroup.getActiveTab();
    var vw = tab.webview;
     vw.search.openSearchWindow();
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
    if (actionName === "full-screen-editor")
        gramHelper.show(data);
    actionProcessor.processAction(actionName, ticketId, webview, data, tabItem);
});

var tabGroup = new TabGroup();



var prevTab = null;
tabGroup.on("tab-removed", (tab, tabGroup) => { tab.ticketId = null; });
tabGroup.on("tab-active", (tab, tabGroup) => {
    if (prevTab)
    prevTab.webview.search.closeSearchWindow();
    prevTab = tab;
    setTimeout(function () {
        ipcRenderer.send('active-tab-changed', tab.ticketId);
    }, 1000);
});

tabGroup.on("tab-added", (tab, tg) => {
    let webview = tab.webview;
    const searchInWebview = searchInPage(webview);
    webview.search = searchInWebview;
    var func = (url) => {
        var downloadMatches = downloader.checkDonwloadLink(url);
        if (downloadMatches)
            webview.getWebContents().downloadURL(url);
        else {
            var isOpened = iscTabs.checkNeedOpen(tabGroup, url);

            if (!isOpened) {
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

const isDev = require('electron-is-dev');
if (isDev) {

    // var uri = 'https://internal.devexpress.com/supportstat/TicketList?Date=&Teams=[{%22ID%22:%229a5630d0-2282-11e2-8364-c44619bb1483%22}]&TicketStatus=AFS&Users=[{%22ID%22:%2200000000-0000-0000-0000-000000000000%22}]';
    // var tab = tabGroup.addTab({
    //     title: 'test',
    //     webviewAttributes: {
    //         plugins: true,
    //         // partition : "persist:stat",
    //     },
    //     src: uri,
    //     visible: true,
    //     active: true,
    //     closable: true,

    // });
    // iscTabs.checkNeedOpen(tabGroup, "https://isc.devexpress.com/Thread/WorkplaceDetails?id=T416406");
    //iscTabs.checkNeedOpen(tabGroup, "https://isc.devexpress.com/ContactBase/Details?userOid=d3377813-6dae-40ea-83d8-8b291e5bfbc8");
    fixedTabs.init(tabGroup);
}
else {
    fixedTabs.init(tabGroup);
}


var tabGroupElement = document.getElementsByClassName('etabs-tabgroup');
tabGroupElement[0].setAttribute("style", "-webkit-app-region: drag;");

shortcuts.bind('alt+shift+q', function () {
    var ticketID = clipboard.readText();
    if (ticketID && ticketID.length <= 7) {
        snackbar.showText('Opening ticket ' + ticketID);
        iscTabs.checkNeedOpen(tabGroup, "https://isc.devexpress.com/Thread/WorkplaceDetails?id=" + ticketID);
    }
});


ipcRenderer.on('activated', function (event, data) {
    var tab = tabGroup.getActiveTab();
    var vw = tab.webview;
    vw.focus();
});

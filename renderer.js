const TabGroup = require("electron-tabs");
// const dragula = require("dragula");
const filesystem = require('fs');
const fixedTabs = require("./scripts/fixed_tabs.js");
const iscTabs = require("./scripts/isc_tabs.js");
const actionProcessor = require("./scripts/action_processor.js");
const path = require('path');

iscTabs.subscribe((actionName, ticketId) => {
    actionProcessor.processAction(actionName,ticketId);
});
var ticketCss = filesystem.readFileSync("./stat_patchers/isc_ticket.css");

var tabGroup = new TabGroup({
    // ready: function (tabGroup) {
    //     dragula([tabGroup.tabContainer], {
    //         direction: "horizontal"
    //     });
    // }
});

tabGroup.on("tab-removed", (tab, tabGroup) => {
    tab.ticketId = null;
});


tabGroup.on("tab-added", (tab, tg) => {
    let webview = tab.webview;
    webview.addEventListener('new-window', (e) => {
        iscTabs.checkNeedOpen(tabGroup, e);
    })
});

fixedTabs.init(tabGroup);



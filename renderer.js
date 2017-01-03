const TabGroup = require("electron-tabs");
const dragula = require("dragula");
const appConfig = require("./app_config.js")
const statApi = require("./stat_api.js")

var tabGroup = new TabGroup({
    ready: function (tabGroup) {
        dragula([tabGroup.tabContainer], {
            direction: "horizontal"
        });
    }
});
let flTab = tabGroup.addTab({
    title: "FL",
    webviewAttributes: {
        preload: './stat_patchers/ticket_list.js'
    },
    src: statApi.getFirstLevelUri(appConfig.teamName),
    visible: true,
    active: true,
    closable: false
});

// let flView = flTab.webview;
// flView.addEventListener('dom-ready', () => {
//   flView.openDevTools()
// })

let slTab = tabGroup.addTab({
    title: "SL",
 webviewAttributes: {
        preload: './stat_patchers/ticket_list.js'
    },
    src: statApi.getFirstLevelUri(appConfig.teamName),
    visible: true,
    closable: false
});

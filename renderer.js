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
    title: "FIRST LEVEL",
    src: statApi.getFirstLevelUri( appConfig.teamName),
    visible: true,
    active :true,
    closable :false
});

let flView = flTab.webview;

flView.addEventListener("dom-ready", function(){
flView.executeJavaScript('$(".mdl-layout__header").hide();$("#top-bar").hide();');
});


let slTab = tabGroup.addTab({
    title: "Electron 2",
    src: "http://electron.atom.io",
    visible: true,
       closable :false
});

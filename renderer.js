const TabGroup = require("electron-tabs");
// const dragula = require("dragula");
const appConfig = require("./app_config.js")
const statApi = require("./stat_api.js")

var tabGroup = new TabGroup({
    // ready: function (tabGroup) {
    //     dragula([tabGroup.tabContainer], {
    //         direction: "horizontal"
    //     });
    // }
});


tabGroup.on("tab-added", (tab, tg) => {
    let webview = tab.webview;
    webview.addEventListener('new-window', (e) => {
        
       var matches = e.url.match(new RegExp("(?:.+)//isc.devexpress.com/Thread/WorkplaceDetails\\?id=(.+)"));
       var id = matches.length == 2?  matches[1]:null ;
        tg.addTab({
            title: id,
            webviewAttributes: {
              //  preload: './stat_patchers/ticket_list.js'
            },
            src: e.url,
            visible: true,
            active: true,
            closable: true
        });
    })
});

tabGroup.addTab({
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

tabGroup.addTab({
    title: "SL",
    webviewAttributes: {
        preload: './stat_patchers/ticket_list.js'
    },
    src: statApi.getSecondLevelUri(appConfig.teamName),
    visible: true,
    closable: false
});



tabGroup.addTab({
    title: "ME",
    webviewAttributes: {
        preload: './stat_patchers/ticket_list.js'
    },
    src: statApi.getMeUri(appConfig.userId, appConfig.teamName),
    visible: true,
    closable: false
});

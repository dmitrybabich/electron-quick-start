class FixedTabsHelper {
    addFixedTab(customProps, ticketCountUri) {
        var props = {
            webviewAttributes: {
                preload: './stat_patchers/ticket_list.js'
            },
            visible: true,
            closable: false,
            webpreferences: "allowDisplayingInsecureContent, allowRunningInsecureContent",
            ready: (tab) => {
                this.enableTicketCountUpdates(tab, ticketCountUri);
            }
        }
        for (var prop in customProps) props[prop] = customProps[prop];
        var tab = this.tabGroup.addTab(props);
    };

    addCounter(tab, className) {
        let span = tab.tab.appendChild(document.createElement("span"));
        span.classList.add("stat-counter", `${className}`);
        span.textContent = "..";
        return span;
    }

    enableTicketCountUpdates(tab, uri) {
        if (!uri)
            return;
        let wv = tab.webview;
        var counter = this.addCounter(tab, 'total');
        var atCounter = this.addCounter(tab, 'at');
        var func = () => {
          //  wv.openDevTools();
            wv.executeJavaScript(`window.getJSON("${uri}");`);
        };
        setTimeout(function () {
            wv.addEventListener('ipc-message', function (event) {
                var json = event.channel;
                var total = json.Total;
                var at = json.AnswerToday;
                counter.textContent = total;
                atCounter.textContent = at ? at : "";
            });
            func();
        }, 1000);
        setInterval(func, 60000);
    }

    setTitle(jsonWebView, tab, uri) {
        this.getJson(jsonWebView, uri, (json) => {
            tab.setTitle(json);
        });
    }


    init(tabGroup) {
        const statApi = require("./stat_api.js");
        const appConfig = require("./app_config.js");
        this.tabGroup = tabGroup;
        // this.addFixedTab({ title: "FL", src: "https://isc.devexpress.com/Thread/WorkplaceDetails?id=T472973", active: true }, statApi.getFirstLevelTicketCountUri(appConfig.teamName));
        // this.addFixedTab({ title: "FL", src: statApi.getFirstLevelUri(appConfig.teamName), active: true }, statApi.getFirstLevelTicketCountUri(appConfig.teamName));
        // this.addFixedTab({ title: "SL", src: statApi.getSecondLevelUri(appConfig.teamName) }, statApi.getSecondLevelTicketCountUri(appConfig.teamName));
        // this.addFixedTab({ title: "ME", src: statApi.getMeUri(appConfig.userId, appConfig.teamName) }, statApi.getMeTicketCountUri(appConfig.userId, appConfig.teamName));
    }
}
module.exports = new FixedTabsHelper();
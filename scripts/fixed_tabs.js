class FixedTabsHelper {
    addFixedTab(customProps, ticketCountUri) {
        var props = {
            webviewAttributes: {
                preload: customProps.disablePatchers ? undefined : './stat_patchers/ticket_list.js',
            },
            visible: true,
            closable: false,
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
            wv.executeJavaScript(`try{window.getJSON('${uri}');}catch(ex){}`);
        };
        wv.addEventListener('dom-ready', () => {
            wv.addEventListener('ipc-message', function (event) {
                var json = event.channel;
                var total = json.Total;
                var at = json.AnswerToday;
                counter.textContent = total;
                atCounter.textContent = at ? at : "";
            });
            func();
        })
        setInterval(func, 30000);
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
        this.addFixedTab({ title: "S", src: statApi.getRepliesUrl(), disablePatchers: true });
        this.addFixedTab({ title: "T", src: statApi.getMyTeamSituatioUrl(appConfig.teamName), disablePatchers: true });
        this.addFixedTab({ title: "FL", src: statApi.getFirstLevelUri(appConfig.teamId), active: true }, statApi.getFirstLevelTicketCountUri(appConfig.teamId));
        this.addFixedTab({ title: "SL", src: statApi.getSecondLevelUri(appConfig.teamId) }, statApi.getSecondLevelTicketCountUri(appConfig.teamId));
        this.addFixedTab({ title: "ME", src: statApi.getMeUri(appConfig.userId, appConfig.teamId) }, statApi.getMeTicketCountUri(appConfig.userId, appConfig.teamId));

    }
}
module.exports = new FixedTabsHelper();
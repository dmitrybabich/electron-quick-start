class IscTabs {

    subscribe(action) {
        this.processAction = action;
    }

    checkNeedOpen(tabGroup, e) {
        var self = this;
        var matches = e.url.match(new RegExp("(?:.+)//isc.devexpress.com/Thread/WorkplaceDetails\\?id=(.+)"));
        var id = matches.length == 2 ? matches[1] : null;
        if (!id)
            return;
        var existingTab = tabGroup.tabs.find(o => o.ticketId === id);
        if (existingTab) {
            existingTab.activate();
        }
        else {
            var tab = tabGroup.addTab({
                title: id,
                webviewAttributes: {
                    preload: './stat_patchers/isc_ticket.js'
                },
                src: e.url,
                visible: true,
                active: true,
                closable: true,
                ready: function (tabItem) {
                    self.onWebViewReady(tabItem);
                },
            });
            tab.ticketId = id;
        }
    }

    processAction(action, ticketId) {
       this.processAction(action, ticketId);
    }


    onWebViewReady(tabItem) {
        var self = this;
        var func = () => {
            var webView = tabItem.webview;
            //webView.openDevTools();
            webView.addEventListener('ipc-message', function (event) {
                var action = event.channel;
                self.processAction(action, tabItem.ticketId);
            });
        };
        setTimeout(func, 500);
    }
}

module.exports = new IscTabs();
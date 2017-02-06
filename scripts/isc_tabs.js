var electron = require('electron');
var shell = electron.shell;

class IscTabs {

    subscribe(action) {
        this.processAction = action;
    }

    getMatches(url) {
        var regExps = [
            { url: "(?:.+)//isc.devexpress.com/Thread/WorkplaceDetails\\?id=(.+)", type: 'Ticket' },
            { url: "(?:.+)//isc.devexpress.com/Thread/WorkplaceDetails/(.+)", type: 'Ticket' },
            { url: "(?:.+)//isc.devexpress.com/ContactBase/Details\\?userOid=(.+)", type: 'User' }
        ];
        for (var i = 0; i < regExps.length; i++) {
            var regExp = new RegExp(regExps[i].url);
            var matches = url.match(regExp);
            if (matches)
                return { matches: matches, type: regExps[i].type };
        }
    }

    checkNeedOpen(tabGroup, url) {
        var self = this;
        var regMatches = this.getMatches(url);
        if (!regMatches)
            return;
        var matches = regMatches.matches;
        var id = matches.length == 2 ? matches[1] : null;
        if (!id)
            return;
        var existingTab = tabGroup.tabs.find(o => o.ticketId === id);
        if (existingTab) {
            existingTab.activate();
        }
        else {
            var preloadFileName = regMatches.type === "Ticket" ? './stat_patchers/isc_ticket.js' : './stat_patchers/isc_user.js';
            var tab = tabGroup.addTab({
                title: id,
                webviewAttributes: {
                    preload: preloadFileName
                },
                src: url,
                visible: true,
                active: true,
                closable: true,
                ready: function (tabItem) {
                    self.onWebViewReady(tabItem);
                },
            });
            tab.ticketId = id;
        }
        return true;
    }

    processAction(action, ticketId, webView, data, tabItem) {
        this.processAction(action, ticketId, webView, data, tabItem);
    }


    onWebViewReady(tabItem) {

        var self = this;
        var func = () => {
            var webView = tabItem.webview;
            var contextMenu = require('electron-context-menu');
            contextMenu({
                window: webView,
                prepend: (params, browserWindow) => {
                    var selectedText = params.selectionText;
                    if (!selectedText)
                        return [];
                    var uri = "https://search.devexpress.com/?q=" + selectedText;
                    return [{
                        label: 'Search text',
                        click: () => { shell.openExternal(uri) },
                        visible: true
                    }];
                }
            });


            webView.addEventListener('ipc-message', function (event) {
                var action = event.channel;
                self.processAction(action, tabItem.ticketId, webView, event.args, tabItem);
            });
        };
        setTimeout(func, 500);
    }
}

module.exports = new IscTabs();
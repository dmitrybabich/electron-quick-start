class ActionProcessor {
    constructor() {
        this.appConfig = require("./app_config.js");
        const {clipboard} = require('electron');
        this.clipboard = clipboard;
        this.path = require('path');
        const {snackbar} = require('./ui.js');
        this.snackbar = snackbar;
    }



    processAction(actionName, ticketId) {
        switch (actionName) {
            case "copy-path": this.copyPath(ticketId); break;
            case "open-folder": this.openFolder(ticketId); break;
            case "create-project": this.openFolder(ticketId); break;
            case "archive-project": this.openFolder(ticketId); break;
            case "create-video-link": this.openFolder(ticketId); break;
            case "create-image-link": this.openFolder(ticketId); break;
            case "convert-project": this.openFolder(ticketId); break;
        }
    }

    getTicketPath() {
        this.path.join(this.appConfig.projectDirectory, ticketId)
    }

    copyPath(ticketId) {
        var path = this.getTicketPath();
        this.clipboard.writeText(path);
        this.snackbar.showText("Copied");
    }

    openFolder(ticketId) {
        var path = this.getTicketPath();
        var shell = require('shell');
        shell.openItem('C:\Users\babich\Dropbox\Apps\totalcmd\TOTALCMD.EXE');
        this.snackbar.showText("Folder opened");
    }
}


module.exports = new ActionProcessor();

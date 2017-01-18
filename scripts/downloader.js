const {TicketProcessor} = require("./action_processor.js");

class Downloader {
    checkDonwloadLink(url) {
        return url.match(new RegExp("(?:.+)//isc.devexpress.com/Attachment/GetAttachment\\?fileOid=(.+)\&fileName=(.+)"));
    }



    registerWindow(win) {
        var downloader = this;
        var listener = (e, item, webContents) => {
            const totalBytes = item.getTotalBytes();
            var ticketID = global.activeTicketId;
            var url = item.getURL();
            var matches = downloader.checkDonwloadLink(url);
            if (!matches)
                return;
            var attachmentId = matches[1];
            var attachmentName = matches[2];
            var processor = new TicketProcessor(ticketID);
            var path = processor.getAttachmentPath(attachmentId, attachmentName);
            var openFileAction = () => {
                processor.exec(path);
            }
            if (processor.fs.existsSync(path)) {
                openFileAction();
                e.preventDefault();
                return;
            }
            item.setSavePath(path);
            item.on('updated', () => {
                const ratio = item.getReceivedBytes() / totalBytes;
                win.setProgressBar(ratio);
            });
            item.on('done', (e, state) => {
                if (!win.isDestroyed()) {
                    win.setProgressBar(-1);
                }
                if (state === 'interrupted') {
                    electron.dialog.showErrorBox("Error");
                } else if (state === 'completed') {
                    openFileAction();
                    if (process.platform === 'darwin') {
                        app.dock.downloadFinished(filePath);
                    }
                }
            });
        }
        win.webContents.session.on('will-download', listener);
    }
}

module.exports = new Downloader();



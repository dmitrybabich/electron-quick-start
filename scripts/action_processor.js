class TicketProcessor {

    ensurePath(path) {
        this.fs.mkdir(path, function (err) {

        });
        return path;
    }

    notify(text) {
        this.snackbar.showText(text);
    }

    copyPath() {
        this.clipboard.writeText(this.projectPath);
        this.notify("Copied")
    }

    openFolder() {
        this.exec(this.appConfig.getFileManagerPath(this.projectPath))
        this.notify("Folder opened");
    }

    createProject() {
        this.exec(this.appConfig.getTemplateProjectsCreatorPath(this.projectPath))
        this.notify("Project creator opened");
    }

    getTicketProjectPath() {
        return this._path.join(this.appConfig.projectDirectory, this.ticketId)
    }

    getZipProjectPath() {
        return this._path.join(this.appConfig.zipProjectDirectory, this.ticketId)
    }

    findSln(path) {
        var files = this.fs.readdirSync(path);
        for (var i in files) {
            var fileName = files[i];
            if (this._path.extname(fileName) === ".sln") {
                return fileName;
            }
        }
    }

    convertToVB() {
        var ticketPath = this.projectPath;
        var vbProjectPath = this.ensurePath(this._path.join(ticketPath, "VB"));
        var files = this.fs.readdirSync(ticketPath);
        var slnFile = this.findSln(ticketPath);
        slnFile = this._path.join(ticketPath, slnFile);
        if (slnFile) {
            var vbConverterPath = this.appConfig.getVBConverterPath(slnFile, vbProjectPath);
            this.exec(vbConverterPath, {
                cwd: this.ticketPath,
            }, (error, s1, s2) => {
                console.log(error);
                console.log(s1);
                console.log(s2);
                if (!error) {
                    this.notify("Project converted");
                    this.clipboard.writeText(vbProjectPath);
                }
                else
                    this.notify("Error!");
            });
        }
        else {
            this.notify('SLN not found');
        }

    }
    createMediaLink(fileName) {
        var mediaPath = this.ensurePath(this._path.join(this.mediaPath, this.getDateFolderName()));
        var mediaFile = this.clipboard.readText();
        var isFile = this.fs.existsSync(mediaFile);
        if (!isFile)
            return;
        var fileExt = this._path.extname(mediaFile);
        var targetFile = this._path.join(mediaPath, fileName + fileExt);
        this.fs.createReadStream(mediaFile).pipe(this.fs.createWriteStream(targetFile));
        this.clipboard.writeText(targetFile);
        this.notify('Copied');
    }

    createVideoLink() {
        this.createMediaLink("dx_video");
    }

    createImageLink() {
        this.createMediaLink("dx_image");
    }
    getDateFolderName() {
        var date = new Date();
        return `${date.getFullYear()}${date.getMonth()}${date.getDate()}${date.getHours()}${date.getMinutes()}`;
    }


    archiveProject() {
        var folderName = this.getDateFolderName();
        var fileName = this.ensurePath(this._path.join(this.zipPath, folderName));
        fileName = this._path.join(fileName, "dx_sample.zip");
        this.exec(this.appConfig.getZipToolPath(fileName), {
            cwd: this.projectPath,
        }, (error, s1, s2) => {
            if (!error) {
                this.notify("Project zipped");
                this.clipboard.writeText(fileName);
            }
            else
                this.notify("Error!");
        });
    }

    getAttachmentPath(attachmentId, fileName) {
        var join = this._path.join;
        var savePath = this.ensurePath(join(this.appConfig.attachmentPath, attachmentId));
        savePath = join(savePath, fileName);
        return savePath;
    }

    constructor(ticketId) {
        this.appConfig = require("./app_config.js");
        const {remote, clipboard} = require('electron');
        this.clipboard = clipboard;
        this._path = require('path');
        const {snackbar} = require('./ui.js');
        const {shell} = require('electron');
        this.shell = shell;
        this.snackbar = snackbar;
        this.exec = require('child_process').exec;
        this.fs = require('fs');
        this.ticketId = ticketId;
        this.projectPath = this.ensurePath(this.getTicketProjectPath(ticketId));
        this.zipPath = this.ensurePath(this.getZipProjectPath(ticketId));
        this.mediaPath = this.ensurePath(this._path.join(this.appConfig.mediaPath, this.ticketId));

    }
}

class ActionProcessor {

    constructor() {

    }

    updateDraftState(tabItem, data) {
        var isDraft = data[0];
        const CLASS_NAME = "draft-icon";
        var tabElement = tabItem.tab;
        var firstElement = tabElement.childNodes[0];
        var isIcon = firstElement.className === CLASS_NAME;
        var el = firstElement;
        if (!isIcon) {
            el = document.createElement("span");
            el.className = CLASS_NAME;
            tabElement.insertBefore(el, firstElement);
        }
        el.innerText = isDraft ? '*' : '';
    }

    processAction(actionName, ticketId, webview, data, tabItem) {
        if (!ticketId)
            return;
        var tp = new TicketProcessor(ticketId);
        switch (actionName) {
            case "copy-path": tp.copyPath(); break;
            case "open-folder": tp.openFolder(); break;
            case "create-project": tp.createProject(); break;
            case "archive-project": tp.archiveProject(); break;
            case "create-video-link": tp.createVideoLink(); break;
            case "create-image-link": tp.createImageLink(); break;
            case "convert-project": tp.convertToVB(); break;
            case "update-draft-state": this.updateDraftState(tabItem, data); break;
        }
    }


}


module.exports = {
    actionProcessor: new ActionProcessor(),
    TicketProcessor: TicketProcessor,
};

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

    walk(fs, dir, callBack) {
        var func = (item) => { return this.walk(fs, item, callBack); };
        var results = []
        var list = fs.readdirSync(dir)
        list.forEach(function (file) {
            file = dir + '\\' + file;
            var stat = fs.statSync(file)
            if (stat && stat.isDirectory())
                results = results.concat(func(file));
            else {
                var isValid = !callBack || callBack(file);
                if (isValid)
                    results.push(file);
            }
        })
        return results;
    }

    findSln(path) {
        var files = this.walk(this.fs, path, (fileName) => {
            return this._path.extname(fileName) === ".sln";
        });
        if (files.length > 0)
            return files[0];
    }

    convertToVB() {
        var ticketPath = this.projectPath;
        var vbProjectPath = this.ensurePath(this._path.join(ticketPath, "VB"));
        var files = this.fs.readdirSync(ticketPath);
        var slnFile = this.findSln(ticketPath);
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

    ensurePaths() {

    }

    getAttachmentPath(attachmentId, fileName) {
        var join = this._path.join;
        var savePath = this.ensurePath(join(this.appConfig.attachmentPath, attachmentId));
        savePath = join(savePath, fileName);
        return savePath;
    }

    openFullScreenEditor(text)
    {
        this.clipboard.writeHTML(text);
        var path = this.appConfig.checkerPath;
        this.exec(path);
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
        this.ensurePath(this.appConfig.rootISCPath);
        this.ensurePath(this.appConfig.projectDirectory);
        this.ensurePath(this.appConfig.zipProjectDirectory);
        this.ensurePath(this.appConfig.mediaPath);
        this.ensurePath(this.appConfig.attachmentPath);
        this.projectPath = this.ensurePath(this.getTicketProjectPath(ticketId));
        this.zipPath = this.ensurePath(this.getZipProjectPath(ticketId));
        this.mediaPath = this.ensurePath(this._path.join(this.appConfig.mediaPath, this.ticketId));

    }
}

class ActionProcessor {


    constructor() {
        this.icons = ["draft-icon", "check-icon"];
        this.iconValues = ["*", "✓"]
    }

    checkCreateIcons(tabElement) {
        if (tabElement.iconsCreated)
            return;
        tabElement.iconsCreated = true;
        var firstElement = tabElement.childNodes[0]
        for (var i = this.icons.length - 1; i >= 0; i--) {
            let icon = document.createElement("span");
            let iconName = this.icons[i];
            icon.className = iconName;
            tabElement.insertBefore(icon, firstElement);
            tabElement[iconName] = { dom: icon, value: this.iconValues[i] };
        }
    }
    setIconState(tabItem, iconName, enabled) {
        var tabElement = tabItem.tab;
        this.checkCreateIcons(tabElement);
        var el = tabElement[iconName];
        el.dom.innerText = enabled ? el.value : '';
    }

    updateDraftState(tabItem, data) {
        this.setIconState(tabItem, "draft-icon", data[0]);
    }

    updateCheckState(tabItem) {
        this.setIconState(tabItem, "check-icon", true);
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
            case "check-button-click": this.updateCheckState(tabItem, data); break;
            case  "full-screen-editor": tp.openFullScreenEditor(data[0]); break;
        }
    }


}


module.exports = {
    actionProcessor: new ActionProcessor(),
    TicketProcessor: TicketProcessor,
};

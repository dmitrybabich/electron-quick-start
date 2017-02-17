class AppConfig {
    constructor() {
        this.userId = "d3377813-6dae-40ea-83d8-8b291e5bfbc8";
        this.teamName = "WinForms";
        this.teamId = "9a5630d0-2282-11e2-8364-c44619bb1483";
        this.rootISCPath = "D:\\ISC\\";
        this.projectDirectory = this.rootISCPath + "Projects";
        this.zipProjectDirectory = this.rootISCPath + "ZIPS";
        this.scToolsPath = "C:\\Users\\babich\\Dropbox\\SCTools";
        this.mediaPath = this.rootISCPath + "Media";
        this.attachmentPath = this.rootISCPath + "Attachments";
        this.templateProjectsPath = this.scToolsPath + "\\TemplateProjects";
        this.totalCmdPath = "C:\\totalcmd\\TOTALCMD64.EXE";
        this.checkerPath =  this.scToolsPath + "\\Checker\\DocumentChecker.exe";
    }

    getFileManagerPath(path) {
        return this.totalCmdPath + ' /R=' + path;
    }

    getTemplateProjectsCreatorPath(path) {
        return this.totalCmdPath + ' /R=' + path + " /L=" + this.templateProjectsPath;
    }

    getZipToolPath(path) {
        var toolsPath = this.scToolsPath;
        return toolsPath + '\\pkzip25.exe -add -dir ' + path + ' @' + toolsPath + '\\FilesToArchive.list';
    }

    getVBConverterPath(slnPath, vbProjectPath) {
        var toolsPath = this.scToolsPath;
        return toolsPath + '\\InstantVB.exe ' + slnPath + ' ' + vbProjectPath;
    }

}
module.exports = new AppConfig();
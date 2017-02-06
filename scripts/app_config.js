class AppConfig {
    constructor() {
        this.userId = "d3377813-6dae-40ea-83d8-8b291e5bfbc8";
        this.teamName = "WinForms";
        this.teamId = "9a5630d0-2282-11e2-8364-c44619bb1483";
        this.projectDirectory = "c:\\ISC\\Projects";
        this.zipProjectDirectory = "C:\\ISC\\ZIPS";
        this.appsPath = "C:\\Users\\babich\\Dropbox\\Apps";
        this.scToolsPath = this.appsPath + "\\!Work\\SCTools";
        this.mediaPath ="C:\\ISC\\Media";
        this.attachmentPath ="C:\\ISC\\Attachments";
    }
    getFileManagerPath(path) {
        return this.appsPath + '\\totalcmd\\TOTALCMD.EXE /R=' + path;
    }

    getTemplateProjectsCreatorPath(path) {
        return this.scToolsPath + '\\TemplateProjects.exe ' + path;
    }

    getZipToolPath(path) {
        var toolsPath = this.scToolsPath + '\\tools';
        return toolsPath + '\\pkzip25.exe -add -dir ' + path + ' @' + toolsPath + '\\FilesToArchive.list';
    }

      getVBConverterPath(slnPath, vbProjectPath) {
        var toolsPath = this.scToolsPath + '\\tools';
        return toolsPath + '\\InstantVB.exe ' + slnPath +' '+  vbProjectPath;
    }

}
module.exports = new AppConfig();
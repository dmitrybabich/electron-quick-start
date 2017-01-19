const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipcMain = electron.ipcMain;
const path = require('path')
const url = require('url');
const actionProcessor = require("./scripts/action_processor.js");
const downloader = require("./scripts/downloader.js");
const debugMode = require("./scripts/debug_mode");



let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({ width: 800, height: 600, frame: false });
  // mainWindow.setMenu(null);
  //  mainWindow.setMenuBarVisibility(false);

  // mainWindow.spellCheckHandler = new SpellCheckHandler();
  // mainWindow.spellCheckHandler.attachToInput();

  // // Start off as US English, America #1 (lol) 
  // mainWindow.spellCheckHandler.switchLanguage('en-US');

  // let contextMenuBuilder = new ContextMenuBuilder(mainWindow.spellCheckHandler);
  // let contextMenuListener = new ContextMenuListener((info) => {
  //   contextMenuBuilder.showPopupMenu(info);
  // });



  var session = mainWindow.webContents.session;
  downloader.registerWindow(mainWindow);
  mainWindow.loadURL(url.format({ pathname: path.join(__dirname, 'index.html'), protocol: 'file:', slashes: true }))
  debugMode.ifDebug(() => { mainWindow.webContents.openDevTools(); });
  mainWindow.on('closed', function () { mainWindow = null });
  ipcMain.on('active-tab-changed', function (event, ticketId) {
    global.activeTicketId = ticketId;
  });
}
app.on('ready', function () { createWindow(); })
app.on('window-all-closed', function () { if (process.platform !== 'darwin') { app.quit() } })
app.on('activate', function () { if (mainWindow === null) { createWindow() } })





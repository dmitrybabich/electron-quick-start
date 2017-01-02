const TabGroup = require("electron-tabs");
const dragula = require("dragula");

var tabGroup = new TabGroup({
    ready: function (tabGroup) {
        dragula([tabGroup.tabContainer], {
            direction: "horizontal"
        });
    }
});
let tab = tabGroup.addTab({
    title: "Electron",
    src: "http://electron.atom.io",
    visible: true,
    active :true
});

let tab2 = tabGroup.addTab({
    title: "Electron 2",
    src: "http://electron.atom.io",
    visible: true
});

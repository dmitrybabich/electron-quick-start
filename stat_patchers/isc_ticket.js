const {ipcRenderer} = require('electron');
const fs = require('fs');

var appendTextScript = (path) => {
    fs.readFile(path, 'utf8', function (err, data) {
        appendscript(undefined, data);
    });

}


var appendscript = (uri, innerhtml) => {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    if (uri)
        script.src = uri;
    if (innerhtml)
        script.innerHTML = innerhtml;
    $(document.body).append(script);
};
var appendcss = (uri) => {
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = uri;
    head.appendChild(link);
};

var customButtonClick = function (e) {
    var link = $(this);
    var actionName = $(this).attr("data-action-name");
    ipcRenderer.sendToHost(actionName);
    e.preventDefault();
};

var appendCustomButton = function (rootContainer, iconName, actionName, title) {
    var container = $("<div></div>");
    container.css("padding", "5px");
    container.css("padding-top", "8px");
    rootContainer.append(container);
    var button = $(`<a target="_blank" href="#" title="${title}" id="isc-btn-${actionName}" data-action-name="${actionName}"><i class="${iconName}"></i></a>`);
    button.css("font-size", "24px");
    button.css("margin", "1px");
    button.css("padding", "1px");
    button.css("padding-top", "10px");
    button.css("text-decoration", "none");
    button.css("color", "#333333");
    button.click(customButtonClick);
    $(container).append(button);
};

var appendCustomButtons = function () {

    var rootContainer = $(".tabbed-bar-nav");
    var container = $("<div></div>");
    container.css("padding-top", "15px");
    rootContainer.append(container);
    appendCustomButton(container, "icon-copy", "copy-path", "Copy path");
    appendCustomButton(container, "icon-folder-open", "open-folder", "Open folder");
    appendCustomButton(container, "icon-plus-sign", "create-project", "Create new project");
    appendCustomButton(container, "icon-archive", "archive-project", "ZIP project");
    appendCustomButton(container, "icon-facetime-video", "create-video-link", "Create video link");
    appendCustomButton(container, "icon-picture", "create-image-link", "Create image link");
    appendCustomButton(container, "icon-rotate-right", "convert-project", "Convert project");
}

var func = () => {
    appendTextScript("stat_patchers/checker.js");
    appendTextScript("stat_patchers/cat.js");
    var cssUri = "https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900&subset=cyrillic";
    appendcss(cssUri);
    setTimeout(() => {
        $("#top-panel").css("top", "-40px");
        $("#main-container").css("top", "0px");
        $("#sidebar").css("top", "0px");
        $(".code-block").css("font-size", "14px");
        $(".code-block").css("line-height", "22px");
        $(".code-block").css("font-family", "'Roboto', sans-serif");
        $(".code-block").css("font-weight", "400");
        $(".pull-left.photo").hide();
        $(".media-body.userinfo>br").remove();
        $("#ticket-header-second-row").css("font-size", "15px");
        $("h4").css("font-size", "18px");
        $("h4").css("font-weight", "400");
        appendCustomButtons();
    }, 500);


};
document.addEventListener("DOMContentLoaded", func)
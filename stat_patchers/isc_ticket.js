const {ipcRenderer} = require('electron');
const fs = require('fs');



var webFrame = require('electron').webFrame
var spellChecker = require('spellchecker');

webFrame.setSpellCheckProvider("en-US", true, {
    spellCheck: function (text) {
        return !(spellChecker.isMisspelled(text));
    }
});

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
    var head = document.getElementsByTagName("head")[0];
    $(document.body).append(script);
    console.log("Appended " + uri);
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

var patchLinks = function () {
    $("a").attr("_target", "blank");
}

var appendCustomButtons = function () {

    var rootContainer = $(".tabbed-bar-nav");
    var container = $("<div></div>");
    container.css("padding-top", "15px");
    rootContainer.append(container);
    appendCustomButton(container, "icon-copy", "copy-path", "Copy path (ctrl+shift+c)");
    appendCustomButton(container, "icon-folder-open", "open-folder", "Open folder (ctrl+shift+o)");
    appendCustomButton(container, "icon-plus-sign", "create-project", "Create new project (ctrl+shift+t)");
    appendCustomButton(container, "icon-archive", "archive-project", "ZIP project (ctrl+shift+z)");
    appendCustomButton(container, "icon-facetime-video", "create-video-link", "Create video link");
    appendCustomButton(container, "icon-picture", "create-image-link", "Create image link");
    appendCustomButton(container, "icon-rotate-right", "convert-project", "Convert project");
}

var func = () => {
    appendTextScript("stat_patchers/checker.js");
    appendTextScript("stat_patchers/cat.js");
    $("#top-panel").css("top", "-40px");
    $("#main-container").css("top", "0px");
    setTimeout(() => {
        setTimeout(function () {

        }, 1000);
        var cssUri = "https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900&subset=cyrillic";
        appendcss(cssUri);
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
        patchLinks();
    }, 2000);


};

document.addEventListener("DOMContentLoaded", func);




document.addEventListener("DOMContentLoaded", () => {
    var iscTools = function () {
        var self = this;
        self.SelectedIDEHelper = new function () {
            var self = this;
            self.run = function () {
                var replaceFunc = (item) => {
                    item.Text = item.Text.replace('Microsoft Visual Studio .NET', 'VS');
                    item.Text = item.Text.replace('Microsoft Visual Studio', 'VS');
                    item.Text = item.Text.replace('Microsoft Visual Web Developer', 'WebDev');
                };
                var ds = fullViewModel.issueDetails.selectedIDE.itemsForRendering();
                ds.forEach(replaceFunc);
                fullViewModel.issueDetails.selectedIDE.itemsForRendering(ds);
            };

        };


        self.ActiveEditorHelper = new function () {
            var self = this;
            self.createButton = function (text, clickFunc) {
                var $btn = $("<a></a>");
                $btn.text(text);
                $btn.attr('href', '#');
                $btn.css('padding', '5px');
                $btn.css('margin', '5px 5px 5px 0px');
                $btn.css('border', 'none');
                $btn.css('background', 'white');
                $btn.css('color', 'gray');
                $btn.addClass('btn');
                $btn.click(function (e) {
                    e.preventDefault();
                    clickFunc();
                });
                return $btn;
            };
            self.addGreeting = function (editor) {
                var fullName = fullViewModel.issueDetails.ticketOwner.publicName();
                var name = fullName.split(' ')[0];
                var firstLetter = name[0];
                var remainingLetters = name.substring(1);
                var finalName = firstLetter.toUpperCase() + remainingLetters.toLowerCase();
                editor.insertContent('Hello ' + finalName + ',');
                editor.insertContent('<br>');
                editor.insertContent('<br>');
            };
            self.addEditorButtons = function (editor) {
                var $buttonContainer = $("<div></div>")
                var $cont = $(editor.editorContainer).parents(".control-group").first();
                $cont.append($buttonContainer);
                var $trimButton = self.createButton('Trim', function () { self.trimEditor(editor); });
                $buttonContainer.append($trimButton);
                var $helloButton = self.createButton('Hello', function () { self.addGreeting(editor); });
                $buttonContainer.append($helloButton);
            };
            self.isDraftTicket = function () {
                var newItems = fullViewModel.newItems;
                let isDraft = false;
                for (var item in newItems) {
                    if (newItems[item].Text.currentValue())
                        isDraft = true;
                }
                for (var item in fullViewModel.issueHistoryItems) {
                    var historyItem = fullViewModel.issueHistoryItems[item];
                    var draft = historyItem.Draft;
                    if (draft && draft.currentValue())
                        isDraft = true;
                    for (var cItem in historyItem.comments) {
                        var comment = historyItem.comments[cItem];
                        var draft = comment.Draft;
                        if (draft && draft.currentValue())
                            isDraft = true;
                    }
                }
                return isDraft;
            };
            self.updateDraftState = function () {
                setTimeout(() => {
                    var isDraft = self.isDraftTicket();
                    ipcRenderer.sendToHost("update-draft-state", isDraft);
                }, 1000);
            };
            self.onEditorFocus = function () {
                self.updateDraftState();
            };
            self.onEditorLeave = function () {
                self.updateDraftState();
            };
            self.updateEditors = function () {
                var editors = tinymce.editors;
                editors.forEach(self.addEditorButtons);
                editors.forEach((editor) => {
                    editor.on('focus', function (e) {
                        self.onEditorFocus(e);
                    });
                    editor.on('blur', function (e) {
                        self.onEditorLeave(e);
                    });
                });
            };
            self.trimCore = function (str, val) {
                var re = new RegExp('^' + val, "g");
                var re2 = new RegExp(val, "g");
                str = str.replace(re, '');
                for (var i = str.length - 1; i >= 0; i--) {
                    if (re2.test(str.charAt(i))) {
                        str = str.substring(0, i + 1);
                        break;
                    }
                }
                return str;

            };
            self.removeDoubleSpaces = function (text) {
                for (var i = 0; i < 10; i++) {
                    text = text.replace(/ +(?= )/g, '');
                    text = text.replace(/ &nbsp;+(?= )/g, '');
                    text = text.replace(/&nbsp;+(?= )/g, '');
                    text = text.replace(/ +(?= )/g, '');
                }
                return text;
            };
            self.trimEditor = function (editor) {
                var text = editor.getContent();
                text = self.trimCore(text, '&nbsp;');
                text = self.removeDoubleSpaces(text);
                for (var i = 0; i < 10; i++) {
                    text = self.trimCore(text, '<br />');
                    text = text.replace('<br /><br />', '<br />');
                }
                editor.setContent(text);
            }

            self.run = function () {
                setInterval(self.updateDraftState, 60000);
                setTimeout(self.updateDraftState, 5000);
                self.updateEditors();
            };
        };

        //========START==========
        self.run = function () {
            setTimeout(function () {
                self.SelectedIDEHelper.run();
                self.ActiveEditorHelper.run();
            }, 5000);
        }
    }
    var iscTools = new iscTools();
    window.iscTools = iscTools;
    iscTools.run();
});


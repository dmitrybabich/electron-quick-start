

const {ipcRenderer} = require('electron');
const fs = require('fs');




var webFrame = require('electron').webFrame
var spellChecker = require('spellchecker');

webFrame.setSpellCheckProvider("en-US", true, {
    spellCheck: function (text) {
        var result = !(spellChecker.isMisspelled(text));
        if (!result)
            console.log(text);
        return result;
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
    $("a").attr("target", "_blank");
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
            patchLinks();
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

    }, 2000);


};

document.addEventListener("DOMContentLoaded", func);




document.addEventListener("DOMContentLoaded", () => {



    var iscTools = function () {
        var self = this;


        self.ResetAssignToHelper = new function () {
            var self = this;
            self.resetAssignTo = function () {
                fullViewModel.issueDetails.selectedAssignTo.value.currentValue("");
            };
            self.run = function () {
                fullViewModel.issueDetails.selectedProduct.value.currentValue.subscribe(self.resetAssignTo);
            };
        };
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
                $btn.html(text);
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

            self.getUserName = function () {
                var fullName = fullViewModel.issueDetails.ticketOwner.publicName();
                var name = fullName.split(' ')[0];
                var firstLetter = name[0];
                var remainingLetters = name.substring(1);
                var finalName = firstLetter.toUpperCase() + remainingLetters.toLowerCase();
                return finalName;
            }

            self.addGreeting = function (editor) {
                editor.insertContent('Hello ' + self.getUserName() + ',');
                editor.insertContent('<br>');
                editor.insertContent('<br>');
                editor.focus();
            };

            self.addWelcome = function (editor) {
                editor.insertContent('You are always welcome ' + self.getUserName() + '!');
            };


            self.addEditorButtonCore = function (name, func) {
                return self.createButton(name, func);
            }
            self.addEditorButtons = function (editor) {
                var $buttonContainer = $("<div></div>")
                var $cont = $(editor.editorContainer).parents(".control-group").first();
                $cont.append($buttonContainer);
                $buttonContainer.append(self.addEditorButtonCore('Full Screen', () => { self.validateEditorText(editor) }));
                $buttonContainer.append(self.addEditorButtonCore('Trim', () => { self.trimEditor(editor) }));
                $buttonContainer.append(self.addEditorButtonCore('Hello', () => { self.addGreeting(editor) }));
                $buttonContainer.append(self.addEditorButtonCore('Welcome', () => { self.addWelcome(editor) }));
                var $suggestionContainer = $("<div></div>");
                $buttonContainer.append($suggestionContainer);
                editor.suggCont = $suggestionContainer;
            };
            self.updateSuggestions = function (editor) {
                setTimeout(() => {
                    self.updateSuggestionsCore(editor);
                }, 100);
            }
            self.updateSuggestionsCore = function (editor) {
                if (!editor)
                    return;
                var $suggestionContainer = editor.suggCont;
                $suggestionContainer.empty();
                var currentWords = self.getFocusedWord();
                var currentWord = null;
                if (currentWords && currentWords.length == 1)
                    currentWord = currentWords[0];
                if (!currentWord)
                    return;
                if (!spellChecker.isMisspelled(currentWord))
                    return;
                var suggestions = spellChecker.getCorrectionsForMisspelling(currentWord);
                var text = "";
                suggestions.forEach((s) => {
                    var button = self.createSuggestionButton(editor, currentWord, s);
                    $suggestionContainer.append(button);
                });
                var button = self.createButton("Add <span class='mdl-color-text--indigo-600'>" + currentWord + "</span> to dictionary", function () {
                    spellChecker.add(currentWord);
                });
                $suggestionContainer.append(button);
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
            self.createSuggestionButton = function (editor, oldText, newText) {
                var $button = self.createButton(newText, function () {
                    self.correctText(editor, newText, oldText);
                });
                return $button;
            };

            self.correctText = function (editor, newText, oldText) {
                var text = editor.getContent();
                text = text.replace(oldText, newText);
                editor.setContent(text);
            };
            self.onEditorFocus = function () {
                self.updateDraftState();
                self.updateSuggestions();
            };
            self.onEditorLeave = function () {
                self.updateDraftState();
                self.updateSuggestions();
            };
            self.updateEditors = function () {
                var editors = tinymce.editors;
                editors.forEach(self.addEditorButtons);
                editors.forEach((editor) => {
                    editor.on('NodeChange', function (ed) {
                        self.updateSuggestions(editor);
                    });
                    editor.on('focus', function (e) {
                        self.onEditorFocus(e);
                    });
                    editor.on('blur', function (e) {
                        self.onEditorLeave(e);
                    });
                });
            };

            self.getFocusedWord = function () {
                var sel = tinymce.activeEditor.selection.getSel();
                var value = sel.focusNode.data;
                if (!value)
                    return null;
                var caretEnd = sel.focusOffset;
                var lastIndex = value.indexOf(' ', caretEnd);
                if (lastIndex == -1)
                    lastIndex = undefined;
                return /\S+$/.exec(value.slice(0, lastIndex));
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

            self.validateEditorText = function (editor) {
                var text = editor.getContent();
                ipcRenderer.sendToHost("full-screen-editor", text);
            }

            self.run = function () {
                setInterval(self.updateDraftState, 60000);
                setTimeout(self.updateDraftState, 5000);
                self.updateEditors();
            };
        };

        self.CheckerHelper = new function () {
            var self = this;
            self.run = function () {
                var btn = $(".postchecker > #btn");
                btn.click(() => {
                    ipcRenderer.sendToHost("check-button-click");
                });
            };
        };

        self.PrevAssigneeHelper = new function () {
            var self = this;
            self.onLinkClick = function (id) {
                fullViewModel.issueDetails.selectedAssignTo.value.currentValue(id);
            };
            self.createAssigneeButton = function (cell, id, name) {
                var link = $("<a href='#'></a>");
                link.text(name);
                link.css('font-size', '10px');
                link.css('display', 'block');
                link.css('color', 'black');
                link.click(function (e) {
                    e.preventDefault();
                    self.onLinkClick(id);
                });
                cell.append(link);
            };
            self.run = function () {

                var owners = [];
                ThreadChangedItems.forEach(function (item) {
                    owners.push(item.Owner);
                    if (item.Comments) {
                        item.Comments.forEach(function (cItem) {
                            owners.push(cItem.Owner);
                        });
                    }
                });
                owners = owners.filter(x => x.Email.endsWith("devexpress.com"));
                var onwerInfos = {};
                owners.forEach(function (item) {
                    onwerInfos[item.Oid] = item.FullName;
                });
                var currentOwner = fullViewModel.issueDetails.selectedAssignTo.value.currentValue();
                var $checkbox = $("#checkbox-CheckedByCorrector");
                var $parent = $checkbox.closest(".sidebar-details-row");
                var $assigneeCol = $('<div class="sidebar-details-col-left"></div>')
                var $assigneeCell = $('<div class="sidebar-details-col-cell"></div>');
                $assigneeCol.append($assigneeCell);
                $parent.append($assigneeCol);
                var keys = [];
                for (var key in onwerInfos) {
                    if (onwerInfos.hasOwnProperty(key)) {
                        if (key !== currentOwner)
                            self.createAssigneeButton($assigneeCell, key, onwerInfos[key]);
                    }
                }
            };
        };

        //========START==========
        self.run = function () {
            setTimeout(function () {
                self.SelectedIDEHelper.run();
                self.ActiveEditorHelper.run();
                self.PrevAssigneeHelper.run();
                self.CheckerHelper.run();
                self.ResetAssignToHelper.run();
            }, 5000);
        }
    }
    var iscTools = new iscTools();
    window.iscTools = iscTools;
    iscTools.run();
});


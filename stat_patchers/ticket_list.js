const {ipcRenderer} = require('electron');

window.getJSON = function (uri) {
    var func = () => {
        $.getJSON(uri, function (json) {
            ipcRenderer.sendToHost(json);
        });
    };
    if (!window.jQuery)
        document.addEventListener("DOMContentLoaded", func);
    else
        func();
};


document.addEventListener("DOMContentLoaded", function (event) {
    $(".mdl-layout__header").remove();
    $("#top-bar").remove();
    $("#replies-list").removeClass("padding10");
    setTimeout(function () {
        var ticketList = $("#ticket-list-main-grid");
        ticketList.attr('id', "el-t-list");
        ticketList.detach();

        $(".mdl-layout__container").remove();
        ticketList.css('height', 'calc(100vh)');
        ticketList.css('position', 'fixed');
        ticketList.css('top', '10px');
        ticketList.css('left', '10px');
        ticketList.css('right', '10px');
        ticketList.css('bottom', '10px');
        $('<div id="ticket-list-main-grid"></div>').appendTo(document.body);
        $('<div id="main-app-container"></div>').appendTo(document.body);
        ticketList.appendTo(document.body);
    }, 5000);



});

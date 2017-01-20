class RepliesItem {

    getJSON(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("get", url, true);
        xhr.responseType = "json";
        xhr.onload = function () {
            var status = xhr.status;
            if (status == 200) {
                callback(null, xhr.response);
            } else {
                callback(status);
            }
        };
        xhr.send();
    };
    getData() {
        const url = 'https://internal.devexpress.com/supportstat/Data/GetRepliesCountByUsers?Date=Today&SupportTeamGuid=9a5630d0-2282-11e2-8364-c44619bb1483';
        this.getJSON(url, (status, data) => {
            if (data && data.length > 3) {
                let i =0;
                data = data.filter((item) => { return i++ < 3 || item.Guid == "d3377813-6dae-40ea-83d8-8b291e5bfbc8" })
            }
            this.data(data);
        });
    };



    constructor() {
        this.request = require('request');
        this.ko = require('knockout');
        this.data = this.ko.observable({});
        this.appConfig = require('./app_config');
    }

    runGetData() {
        this.getData();
        setTimeout(()=>{this.getData}, 60000);
    }


}


module.exports = { RepliesItem: RepliesItem }
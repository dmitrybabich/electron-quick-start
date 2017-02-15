var Logic = function () {
    var self = this;
    this.request = require('request');
    this.ko = require('knockout');
    this.data = this.ko.observable({});
    var Datastore = require('nedb');
    this.db = new Datastore({ filename: 'ticket_history.db', autoload: true });
    this.idCache = {};
    this.distinct = function (item) {
        var found = self.idCache[item.ticketId];
        self.idCache[item.ticketId] = true;
        return !found;
    }

    this.filter = function (data) {
        data = data.filter(self.distinct);
        data.sort(function (item1, item2) {
            return item2.date - item1.date;
        });
        return data;
    };

    this.refresh = function () {
        self.idCache = {};
        self.db.find({}, (err, docs) => {
            var data = self.filter(docs);
            self.data(data);
        });
    };

    this.run = function () {
        self.refresh();
        self.ko.applyBindings(self);
    };
};



document.addEventListener("DOMContentLoaded", function (event) {
    var logic = new Logic();
    logic.run();
    setTimeout(logic.refresh, 160000);
});


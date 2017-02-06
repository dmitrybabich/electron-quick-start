var func = function () {
    var licenseHelper = function () {
        var self = this;
        self.onButtonClick = function () {
            var move = function () {
                // var userDetailGroupsTab = $("#user-details-groups-tab")
                // var notesTab = $("#user-details-notes-tab");
                // notesTab.detach();
                // userDetailGroupsTab.append(notesTab);
            };
            $('.nav-tabs a[href="#user-details-notes-tab"]').tab('show');
            setTimeout(function () {
                $('.nav-tabs a[href="#user-details-groups-tab"]').tab('show')
                setTimeout(function () {
                    move();
                }, 2400);
            }, 2400);

        };
        self.createButton = function () {

            var parent = $("#contact-avatar-block");
            var button = $("<button>Ask license</button>")
            button.click(self.onButtonClick);
            parent.append(button);
        };
        self.run = function () {
            self.createButton();
        }
    };

    new licenseHelper().run();

};

document.addEventListener("DOMContentLoaded", func);
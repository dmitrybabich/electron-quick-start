
// ==UserScript==
// @name        Categorization
// @namespace   DXCategorization
// @description Ticket Categorization
// @include     https://isc.devexpress.com/Thread/WorkplaceDetails*
// @version     1.0.22
// @grant       none
// ==/UserScript==

$().ready(function () {
    var defaultURL = 'https://internal.devexpress.com/supportstat/TicketCategories/';
    var detailTabSelector = "#tab-ticket-details";
    var catEditFrameUri = "https://internal.devexpress.com/supportstat/Tickets/Categories/EditProduct";
    var renderLoadingPanel = function (rootElement) {
        var divElement = $('<div id="ajax_loader"></div>').css({ 'position': 'absolute', 'display': 'none', 'z-index': '100', 'background-color': '#F5F5F5', 'justify-content': 'center', 'align-items': 'center' });
        var imgElement = $('<img id="ajax_loader" src="https://internal.devexpress.com/supportstat/Content/Images/CaT_Loading.gif"></img>').css({ 'width': '100px', 'height': '75px' });
        divElement.append(imgElement);
        rootElement.append(divElement);
    };

    var renderSimpleComboBox = function (rootElement) {
        var spanElement = $('<span class="sidebar-details-title" data-bind="text: label"></span>');
        rootElement.append(spanElement);

        var divElement = $('<div></div>').attr('data-bind', "attr: { title: value.currentText() }");

        var selectElement = $("<select></select>").attr("data-bind", "attr: { id: name }, value: value.currentValue, options: dataSource, optionsText: 'label', optionsValue: 'value', select2: options, enable: enabled");

        divElement.append(selectElement);

        rootElement.append(divElement);
    };

    var renderGroupedComboBox = function (rootElement) {
        var spanElement = $('<span class="sidebar-details-title" data-bind="text: label"></span>');
        rootElement.append(spanElement);

        var divElement = $('<div></div>').attr('data-bind', "attr: { title: value.currentText() }").addClass('controls');

        var selectElement = $("<select></select>").attr("data-bind", "attr: { id: name }, foreach: { data: dataSource, as: 'group' }, value: value.currentValue, optionsText: 'label', optionsValue: 'value', select2: options, enable: enabled").css('width', '100%');

        selectElement.append("<!-- ko if: group.label == 'emptyGroup' -->");
        selectElement.append($('<option></option>'));
        selectElement.append("<!-- /ko -->");
        selectElement.append("<!-- ko ifnot: group.label == 'emptyGroup' -->");

        var optGroupElement = $('<optgroup></optgroup>').attr("data-bind", "attr: { label: group.label }, foreach: { data: group.groupItems, as: 'option' }");
        optGroupElement.append($("<option></option>").attr("data-bind", "text: option.label, value: option.value"));
        selectElement.append(optGroupElement);
        selectElement.append("<!-- /ko -->");

        divElement.append(selectElement);

        rootElement.append(divElement);
    };

    var renderCmb = function (renderFunc, property) {
        var cmb = $("<div></div>").attr("data-bind", "with: " + property);
        renderFunc(cmb);
        return cmb;
    };

    var renderCell = function (renderFunc, property, customContent, cellCss) {
        var cell = $("<div></div>").addClass("sidebar-details-col-cell");
        if (cellCss)
            cellCss(cell);
        var content = customContent ? customContent() : renderCmb(renderFunc, property);
        cell.append(content);
        return cell;
    };
    var fullClass = "sidebar-details-col-full";
    var leftClass = "sidebar-details-col-left";
    var rightClass = "sidebar-details-col-right";

    var renderRowContent = function (row, renderFunc, property, css, customContent, cellCss) {
        var rowContent = $("<div></div>").addClass(css);
        var cell = renderCell(renderFunc, property, customContent, cellCss);
        rowContent.append(cell);
        row.append(rowContent);
        return rowContent;
    };

    var renderRow = function (rootElement) {
        var row = $("<div></div>").addClass("sidebar-details-row");
        rootElement.append(row);
        return row;
    };

    var renderReplyBlock = function (container) {
        var row = renderRow(container);
        var linkRender = function () {


            var historyIcon = $('<a target="_blank" tabindex="-1" ></a>');
            historyIcon = historyIcon.append("<i class='icon-time' style='padding: 10px;'></i>");
            historyIcon = historyIcon.attr('href', 'https://internal.devexpress.com/supportstat/Tickets/Categories/TicketHistory' + '?ticketID=' + supportCenter.model.ticket.ArticleId);
            historyIcon = historyIcon.append("<span></span>");

            var reloadIcon = $('<a title="Reload combo box values" tabindex="-1" target="_blank"  href="#" data-bind="click: reload"></a>');
            reloadIcon = reloadIcon.append("<i class='icon-repeat' style='padding: 10px;'></i>");
            reloadIcon = reloadIcon.append("<span></span>");



            var editIcon = $('<a title="Edit" tabindex="-1" target="_blank"  href="#" data-bind="click: editCaT"></a>');
            editIcon = editIcon.append("<i class='icon-edit' style='padding: 10px;'></i>");
            editIcon = editIcon.append("<span>Edit</span>");


            var result = $('<div class="pull-right"></div>');

            result.append(editIcon);
            result.append(historyIcon);
            result.append(reloadIcon);
            ko.applyBindings(viewModel, result[0]);
            return result;
        };
        var content = renderRowContent(row, renderGroupedComboBox, 'selectedReply', leftClass);
        //    content.append('<span data-bind="with:suggestionsViewModel"><span data-bind="text:Replies"></span></span>');

        var centerCss = function (target) { target.css("align-self", "center").css("padding-top", "12px"); };
        renderRowContent(row, '', '', rightClass, linkRender, centerCss).css("display", "flex").css("justify-content", "center");
    }

    var renderComponentBlock = function (container) {
        var row = renderRow(container);
        var controlRow = renderRowContent(row, renderGroupedComboBox, 'selectedControl', leftClass);
        var featureRow = renderRowContent(row, renderSimpleComboBox, 'selectedFeature', rightClass);
        lastRow = featureRow;
        return featureRow;
    };

    var renderSeparator = function (rootElement) {
        var separator = $("<div></div>").addClass("sidebar-details-row-separator");
        rootElement.append(separator);
        return separator;
    };

    var renderPlainRow = function (container, height) {
        var row = $('<div  class="sidebar-details-row"></div>');
        var left = $('<div  class="sidebar-details-col-left"></div>');
        var right = $('<div  class="sidebar-details-col-left"></div>');
        var leftCell = $('<div  class="sidebar-details-col-cell"></div>');
        var rigthCell = $('<div  class="sidebar-details-col-cell"></div>');
        if (height) {
            left.css('height', height);
            right.css('height', height);
        }
        $(container).append(row);
        left.append(leftCell);
        right.append(rigthCell);
        row.append(left).append(right);
        return {
            root: row,
            leftCell: leftCell,
            rigthCell: rigthCell,
        };
    }
    var renderReplySuggestions = function (container) {
        return renderSuggestionsCore(container, "replySuggestions", "selectedReply");
    }

    var renderComponentSuggestions = function (container) {
        return renderSuggestionsCore(container, "componentSuggestions", "selectedControl");
    }

    var renderFeatureSuggestions = function (container) {
        return renderSuggestionsCore(container, "featureSuggestions", "selectedFeature");
    }

    var renderSuggestionsCore = function (container, collectionName, propName) {
        var itemToAdd = $('<span data-bind="foreach:' + collectionName + '"></span>');
        var childTemplate = $('<a  tabindex="-1" href="#" onclick="this.blur()" class="cat-small-link" data-bind="text:Text, click: function(args){ $parent.setSuggestionValue($parent.' + propName + ', args)}">');
        itemToAdd.append(childTemplate);
        $(container).append(itemToAdd);
        return itemToAdd;
    }

    var renderComboBoxes = function (container) {
        catDiv = $("<div id='CaT' data-bind='visible: comboBoxVisible'></div>");
        container.append(catDiv);
        renderLoadingPanel(firstSeparator);
        renderReplyBlock(catDiv);
        var row = renderPlainRow(catDiv, '10px');
        renderReplySuggestions(row.leftCell);
        renderSeparator(catDiv);
        renderComponentBlock(catDiv);
        row = renderPlainRow(catDiv, '20px');
        row.rigthCell.css('float', 'right');
        row.leftCell.css('float', 'left');
        renderComponentSuggestions(row.leftCell);
        renderFeatureSuggestions(row.rigthCell);
        row = renderPlainRow(catDiv);
        row.rigthCell.css('padding-top', '25px');
        row.rigthCell.css('float', 'right');
        renderTicketSearchLink(row.rigthCell);
        ko.applyBindings(viewModel, catDiv[0]);
    };

    var renderErrorPanel = function (container) {
        var panel = $("<div id='sad-cat' style='float: left; width: 100%' data-bind='visible: isCatError'></div>");
        container.append(panel);
        panel.append($("<span  style='float: left; padding-top: 4px' class='emptyValue' ></span>").html("Error loading CaT"));
        panel.append($("<span class='btn' style='float: right' data-bind='click: reload'></span>").html("Reload"));
        ko.applyBindings(viewModel, panel[0]);
    };


    var renderNotSupportedProductPanel = function (container) {
        var panel = $("<div id='not-supported-cat' style='float: left; width: 100%' data-bind='visible: disabledProductText()'></div>");
        container.append(panel);
        panel.append($("<span class='grayedWarning' style='float: left; padding-top: 4px' data-bind='text:disabledProductText'></span>"));
        panel.append($("<span class='grayedWarning' style='float: left; padding-top: 4px'>&nbsp;tickets should not be categorized</span>"));
        panel.append($("<span class='btn' style='float: right' data-bind='click: reload'></span>").html("Reload"));
        ko.applyBindings(viewModel, panel[0]);
    };

    var firstSeparator;

    var lastRow;

    var catDiv;

    renderModalWindow = function () {
        var mainDiv = $('<!-- Modal --><div style="display:none" class="modal fade" id="catEditModalWindow" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">     <div class="modal-content" id="modalCatContent">      <div class="modal-header">        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>        <h4 class="modal-title" id="myModalLabel">Edit Controls and Features</h4>      </div>      <iframe  id="CaTEditFrame" width="98%" height="95%" frameborder="0" allowtransparency="false"></iframe>   <!-- /.modal-content -->  </div>  <!-- /.modal-dialog --></div><!-- /.modal -->');
        var $div = mainDiv.appendTo('body');
        $div.css('top', '10%');
        $div.css('left', '10%');
        $div.css('width', '80%');
        $div.css('height', '80%');
        $div.css('margin', '0');
        $div.css('padding', '0');
        $div.css('margin-right', 'auto');
        $div.css('margin-left', 'auto');
        var modalContent = $("#modalCatContent");
        modalContent.css('height', '99%');
    };

    var renderCaT = function () {
        var ticketDetails = $(detailTabSelector);
        firstSeparator = renderSeparator(ticketDetails).css({ 'border-top': '1px solid rgb(211, 211, 211)', 'margin-top': '15px' });
        renderComboBoxes(ticketDetails);
        renderErrorPanel(ticketDetails);
        renderNotSupportedProductPanel(ticketDetails);
        renderModalWindow();
    };

    var renderTicketSearchLink = function (cell) {
        //  var row = renderPlainRow(container);
        var linkRender = function () {
            var panel = $("<div id='ticketSearch' data-bind='visible:searchLink' style='padding:2px'><i style='padding-right:2px' class='icon-search'></i><a target='_blank' href='#' data-bind='attr:{href:searchLink}'>Ticket Search</a></div>");
            var result = $('<div></div>');
            result.append(panel);
            ko.applyBindings(viewModel, result[0]);
            return result;
        };
        $(cell).append(linkRender());

        //    renderRowContent(row, '', '', leftClass, linkRender);

    };

    //var CaTBasicItem = function (devVal, onValueChanged) {
    //    var self = this;
    //    self.defaultValue = devVal;
    //    self.currentValue = ko.observable(devVal);
    //    self.currentValue.subscribe(function (newVal) {
    //        if (onValueChanged)
    //            onValueChanged(newVal);
    //    });
    //    self.hasChanged = ko.computed(function () {
    //        if (supportCenter.common.workplaceItems.areNotEquals(self.defaultValue, self.currentValue())) {
    //            return true;
    //        } else {
    //            return false;
    //        }
    //    });
    //    self.onReset = function () {
    //        self.currentValue(self.defaultValue);
    //    };
    //};

    //var CaTBaseSelect2BoxModel = function (item, model, defaultOptions, configuration, onValueChanged) {
    //    var Group = function (label, groupItems) {
    //        this.label = label;
    //        this.groupItems = groupItems;
    //    }
    //    var Option = function (label, value, attributes) {
    //        this.label = label;
    //        this.value = value;
    //        this.attributes = attributes;
    //    }
    //    item.name = model.name;
    //    item.label = model.label;
    //    item.type = model.type;
    //    item.enabled = ko.observable(model.enabled === undefined ? true : model.enabled);
    //    item.visible = ko.observable(model.visible === undefined ? true : model.visible);
    //    item.value = new CaTBasicItem(model.value, onValueChanged);
    //    item.value.currentText = ko.observable();
    //    item.options = $.extend({ width: 'copy', placeholder: "<span class='emptyValue'>empty<span>" }, configuration);
    //    item.useGroupping = model.groupping && model.groupping;
    //    item.filtered = ko.observable(true);
    //    if (configuration.trackChanges === undefined || configuration.trackChanges === true) {
    //        item.value.hasChanged = ko.computed(function () {
    //            if (supportCenter.common.workplaceItems.areNotEquals(item.value.defaultValue, item.value.currentValue())) {
    //                supportCenter.common.changesCounter.addIfNonExist(item.name);
    //                return true;
    //            } else {
    //                supportCenter.common.changesCounter.removeIfExist(item.name);
    //                return false;
    //            }

    //        });
    //    }
    //    item.renderGroupedSelect2Items = function (values) {
    //        var items = {};
    //        items['emptyGroup'] = {};
    //        $.each(values, function () {
    //            if (items[this.Attributes.GroupName] == null) {
    //                items[this.Attributes.GroupName] = new Array();
    //            }
    //            items[this.Attributes.GroupName].push(new Option(this.Text, this.Value, this.Attributes));
    //        })
    //        var result = new Array();
    //        $.map(items, function (options, label) {
    //            result.push(new Group(label, options));
    //        });
    //        return result;
    //    };
    //    item.renderSimpleSelect2Items = function (values, addEmptyOption) {
    //        var result = addEmptyOption ? new Array(new Option("", "", null)) : new Array();
    //        if (values != null && values.length > 0)
    //            $.each(values, function () {
    //                result.push(new Option(this.Text, this.Value, this.Attributes));
    //            });
    //        return result;
    //    };
    //    item.itemsForRendering = ko.observableArray(supportCenter.common.ensureValue(model.value, defaultOptions == null ? model.items : defaultOptions));
    //    item.dataSource = ko.computed(function () {
    //        var defaultCollection = item.itemsForRendering();
    //        if (item.useGroupping) {
    //            return item.renderGroupedSelect2Items(defaultCollection);
    //        }
    //        return item.renderSimpleSelect2Items(defaultCollection, item.options.allowClear !== undefined && item.options.allowClear);
    //    });

    //    item.value.currentValue.subscribe(function () {
    //        item.updateText();
    //    });
    //    item.updateText = function () {
    //        var $container = $('[id="' + item.name + '"]').select2('container');
    //        if (!$container && $container.length == 0) {
    //            item.value.currentText(null);
    //        } else {
    //            var text = $container.find('.select2-choice').text().trim();
    //            item.value.currentText(text == 'empty' ? '' : text);
    //        }
    //    };
    //    return item;
    //};


    //var CaTSelect2BoxModel = function (item, model, params) {
    //    return CaTBaseSelect2BoxModel(item, model, null, {
    //        allowClear: true,
    //        minimumResultsForSearch: 5,
    //        width: '100%',
    //        escapeMarkup: function (m) { return m; },
    //        formatResult: params.templateFormat,
    //    }, params.onValueChanged);
    //};



    var comboBoxValueItem = function (onValueChanged) {
        var self = this;
        self.setDefaultValue = function (defVal) {
            self.lockEvents = true;
            self.defaultValue = defVal;
            self.currentValue(defVal);
        }
        self.defaultValue = null;
        self.currentValue = ko.observable(null);
        self.onValueChanged = onValueChanged;
        self.currentValue.subscribe(function (newVal) {
            if (self.onValueChanged)
                self.onValueChanged(newVal);
        });
        self.hasChanged = ko.computed(function () {
            return supportCenter.common.workplaceItems.areNotEquals(self.defaultValue, self.currentValue());
        });
        self.onReset = function () {
            self.currentValue(self.defaultValue);
        };
    };

    var comboBoxViewModel = function (config) {
        config = config ? config : {};
        var item = this;
        item.model = null;
        item.configuration = {
            allowClear: true,
            minimumResultsForSearch: 5,
            width: '100%',
            escapeMarkup: function (m) { return m; },
            formatResult: config.templateFunc,
            trackChanges: true
        };
        var Group = function (label, groupItems) {
            this.label = label;
            this.groupItems = groupItems;
        };
        var Option = function (label, value, attributes) {
            this.label = label;
            this.value = value;
            this.attributes = attributes;
        };
        item.dataSource = ko.observable(null);
        item.setModel = function (model) {
            item.model = model;
            item.name = model.name;
            item.label = model.label;
            item.type = model.type;
            item.enabled = ko.observable(model.enabled === undefined ? true : model.enabled);
            item.visible = ko.observable(model.visible === undefined ? true : model.visible);
            item.useGroupping = model.groupping && model.groupping;
            item.itemsForRendering = ko.observableArray(supportCenter.common.ensureValue(model.value, model.items));
            item.dataSource(item.getDataSource());
            item.value.setDefaultValue(model.value);
        };
        item.options = $.extend({ width: 'copy', placeholder: "<span class='emptyValue'>empty<span>" }, item.configuration);
        item.getDataSource = function () {
            if (!item.itemsForRendering)
                return null;
            var defaultCollection = item.itemsForRendering();
            if (item.useGroupping) {
                return item.renderGroupedSelect2Items(defaultCollection);
            }
            return item.renderSimpleSelect2Items(defaultCollection, item.options.allowClear !== undefined && item.options.allowClear);
        };
        item.value = new comboBoxValueItem(config.onValueChanged);
        item.value.currentText = ko.observable();

        item.filtered = ko.observable(true);
        if (item.configuration.trackChanges === true) {
            item.value.hasChanged = ko.computed(function () {
                if (supportCenter.common.workplaceItems.areNotEquals(item.value.defaultValue, item.value.currentValue())) {
                    supportCenter.common.changesCounter.addIfNonExist(item.name);
                    return true;
                } else {
                    supportCenter.common.changesCounter.removeIfExist(item.name);
                    return false;
                }

            });
        }
        item.renderGroupedSelect2Items = function (values) {
            var items = {};
            items['emptyGroup'] = {};
            $.each(values, function () {
                if (items[this.Attributes.GroupName] == null) {
                    items[this.Attributes.GroupName] = new Array();
                }
                items[this.Attributes.GroupName].push(new Option(this.Text, this.Value, this.Attributes));
            })
            var result = new Array();
            $.map(items, function (options, label) {
                result.push(new Group(label, options));
            });
            return result;
        };
        item.renderSimpleSelect2Items = function (values, addEmptyOption) {
            var result = addEmptyOption ? new Array(new Option("", "", null)) : new Array();
            if (values != null && values.length > 0)
                $.each(values, function () {
                    result.push(new Option(this.Text, this.Value, this.Attributes));
                });
            return result;
        };



        item.value.currentValue.subscribe(function () {
            item.updateText();
        });
        item.updateText = function () {
            var $container = $('[id="' + item.name + '"]').select2('container');
            if (!$container && $container.length == 0) {
                item.value.currentText(null);
            } else {
                var text = $container.find('.select2-choice').text().trim();
                item.value.currentText(text == 'empty' ? '' : text);
            }
        };
        return item;
    }

    var CaTViewModel = function () {
        //   debugger;
        var self = this;
        self.setViewModel = function (item, data) {
            var prevValue = item.value.currentValue();
            item.setModel(data);
            if (prevValue)
                item.value.currentValue(prevValue);
            self.updateModels();
            self.updateSearchLink();
        };
        self.setSuggestionValue = function (model, link) {

            logSuggestionClick(model().name);
            model().value.currentValue(link.Value);
        };
        self.setSuggestionsViewModel = function (data) {
            self.setArrayValue(data.Replies, self.replySuggestions);
            self.setArrayValue(data.Components, self.componentSuggestions);
            self.setArrayValue(data.Features, self.featureSuggestions);
        };
        self.setArrayValue = function (data, func) {
            //debugger;
            //if (data && data.length > 0)
            func(data);
        };
        self.replySuggestions = ko.observable([]);
        self.featureSuggestions = ko.observable([]);
        self.componentSuggestions = ko.observable([]);
        self.selectedReply = ko.observable(null);
        self.selectedControl = ko.observable(null);
        self.selectedFeature = ko.observable(null);
        self.updateModels = function () {
            self.selectedReply(self.getModelOrNull(self.selectedReplyModel));
            self.selectedControl(self.getModelOrNull(self.selectedControlModel));
            self.selectedFeature(self.getModelOrNull(self.selectedFeatureModel));
        };

        self.selectedReplyModel = ko.observable(new comboBoxViewModel());
        self.highlightShared = function (control) {
            var id = control.id;
            var item = $.grep(self.selectedControlModel().model.items, function (v, i) { return v.Value == id; })[0];
            if (item) {
                if (item.Shared)
                    return $('<span class="shared">' + control.text + '</span>');
                if (item.TeamShared)
                    return $('<span class="team-shared">' + control.text + '</span>');
            }
            return control.text;
        };
        self.onFeatureChanged = function () {
            getSuggestions();
            self.updateSearchLink();
        };
        self.selectedControlModel = ko.observable(new comboBoxViewModel({ templateFunc: self.highlightShared, onValueChanged: onControlChanged }));
        self.selectedFeatureModel = ko.observable(new comboBoxViewModel({ onValueChanged: self.onFeatureChanged }));
        self.getModelOrNull = function (selector) {
            var model = selector();
            return model.model === null ? null : model;
        };

        self.onFeatureChanged = function (newValue) {
            self.updateSearchLink(newValue);
        };
        self.searchLink = ko.observable(null);
        self.getSearchLink = function () {
            var newValue = self.selectedFeatureModel().value.currentValue();
            if (newValue)
                return 'https://internal.devexpress.com/supportstat/Tickets/Categories/TicketSearch' + '?feature=' + newValue + '&control=' + self.selectedControlModel().value.currentValue();
            return null;
        };
        self.updateSearchLink = function () {
            self.searchLink(self.getSearchLink());
        };

        self.editCatUri = undefined;
        self.editCaT = function () {
            if (!self.editCatUri) {
                var uri = catEditFrameUri + "?EmbeddedMode=true&";
                var ti = collectTicketInfo();
                var ci = collectCaTInfo();
                uri += $.param(ti) + "&";
                uri += $.param(ci);
                self.editCatUri = uri;
                $('#CaTEditFrame').attr('src', self.editCatUri);
            }
            $('#catEditModalWindow').modal('show');
        };
        self.reload = function () {
            self.isCatError(false);
            initLoad();

        };
        self.isCatError = ko.observable(false);
        self.historyItemCount = 0;
        self.newItemsCount = 0;
        self.calcItemPropsCount = function (item) {
            for (var prop in item) {
                var childItem = item[prop];
                if (childItem.ItemType === 1 || childItem.ItemType === 2) {
                    self.historyItemCount++;
                }
                self.calcItemPropsCount(childItem.comments);
            };
        };
        self.calcHistoryItemsCount = function () {
            self.historyItemCount = 0;
            self.calcItemPropsCount(fullViewModel.issueHistoryItems);
            return self.historyItemCount;
        };
        self.calcNewItemsCount = function () {
            var newItemsCount = 0;
            for (var prop in fullViewModel.newItems) {
                if (fullViewModel.newItems.hasOwnProperty(prop)) {
                    var draft = fullViewModel.newItems[prop].Draft;
                    if (draft)
                        if (!draft.currentValue())
                            newItemsCount++;
                }
            }
            return newItemsCount;
        };
        self.totalHistoryItemCount = 0;
        self.calcTotalHistoryItemCount = function () {
            self.totalHistoryItemCount = self.calcNewItemsCount() + self.calcHistoryItemsCount();
            return self.totalHistoryItemCount;
        };
        self.isDuplicated = function () {

            return fullViewModel && fullViewModel.issueDetails.originalTicketId.select2.value && fullViewModel.issueDetails.originalTicketId.select2.value.currentValue();
        };
        self.isBugReport = function () {
            return $("#ticket-type-bage").text().trim().toLowerCase() === "bug report";
        };
        self.preventValidateReply = function () {
            return self.isBugReport() || self.disabledProductText() || self.isCatError() || self.isArticleWithoutReplies() || self.isDuplicated();
        };
        self.disabledProductText = ko.computed(function () {
            if (self.isCatError())
                return null;
            var value = fullViewModel.issueDetails.selectedProduct.value.currentValue();
            if (value === "308df7aa-6e50-11e3-8ede-5442496457d0" /* Licensing*/ ||
                value === "4882eeba-6e50-11e3-8ede-5442496457d0" /*Trial Extensions*/ ||
                value == "1ed623ca-6e50-11e3-8ede-5442496457d0" /*Ordering*/)
                return fullViewModel.issueDetails.selectedProduct.value.currentText();
            return null;
        }, self);
        self.isArticleWithoutReplies = ko.computed(function () {
            var result = self.calcTotalHistoryItemCount();
            return result === 0;
        }, self);



        self.comboBoxVisible = ko.computed(function () {
            if (self.isCatError())
                return false;
            if (self.disabledProductText())
                return false;
            return true;
        });
    };


    var viewModel;

    var init = function () {
        viewModel = new CaTViewModel();
        fullViewModel.CatViewModel = viewModel;
        renderCaT();
        overrideSubmit();
    };

    var overrideSubmit = function () {
        var originalSubmit = fullViewModel.bottomPanelItems.submitButtonClick;
        fullViewModel.bottomPanelItems.submitButtonClick = function () {
            var args = arguments;
            var replyModel = viewModel.selectedReply();
            var controlModel = viewModel.selectedControl();
            var featureModel = viewModel.selectedFeature();

            if (!replyModel || !controlModel || !featureModel) {
                originalSubmit.apply(fullViewModel.bottomPanelItems, args);
                return;
            }

            var status = fullViewModel.issueDetails.selectedStatus.value.currentValue();
            var reply = replyModel.value.currentValue();
            if (!viewModel.preventValidateReply() && !reply && status !== "ActiveForSupport") {
                showReplyAlert();
            }
            else {
                loader.showDialog();
                postData().fail(function () {
                    loader.hideDialog();
                    var confirmHandler = function () {
                        confirmDialog.hideDialog();
                        originalSubmit.apply(fullViewModel.bottomPanelItems, args);
                    };
                    showPostFailAlert(confirmHandler);
                }).done(function () {
                    loader.hideDialog();
                    originalSubmit.apply(fullViewModel.bottomPanelItems, args);
                });
            }
        }
    };

    var showReplyAlert = function () {
        alertDialog.confirmHandler = alertDialog.hideDialog;
        var message = "<p>Reply is empty.</p>";
        message += "<p>Please, specify the <b>Reply</b> field.</p>"
        alertDialog.showDialog("Warning!", message);
    };

    var showPostFailAlert = function (confirmHandler) {
        confirmDialog.confirmHandler = confirmHandler;
        var message = "<p>Do you want to post the rest of the ticket?</p>"
        confirmDialog.showDialog("Error saving CaT!!!", message);
    };

    var postData = function () {
        return performRequest('post', "SaveTicketInfo", function () { }, { ticketInfo: collectTicketInfo(), catInfo: collectCaTInfo() }, function () { });
    };

    var logSuggestionClick = function (propertyName) {
        return performRequest('post', "SaveCatSuggestionClickToLog", function () { }, { ticketInfo: collectTicketInfo(), suggestionType: propertyName }, function () { });
    };

    var needGetSuggestions = false;

    var getSuggestions = function () {
        needGetSuggestions = true;
        setTimeout(function () {
            if (needGetSuggestions) {
                needGetSuggestions = false;
                getSuggestionsCore();
            }
        }, 500);
    };

    var getSuggestionsCore = function () {
        return performRequest('post', "GetTicketCaTSuggestions", function (data) { viewModel.setSuggestionsViewModel(data); }, { ticketInfo: collectTicketInfo(), catInfo: collectCaTInfo() }, function () { });
    };

    var collectTicketInfo = function () {
        return { ticket: supportCenter.model.ticket.ArticleId, ticketId: supportCenter.model.ticket.Id, supporter: supportCenter.model.ticket.CurrentUserId, platform: fullViewModel.issueDetails.selectedCategory.value.currentValue(), product: fullViewModel.issueDetails.selectedProduct.value.currentValue() };
    };

    var collectCaTInfo = function () {
        return { reply: viewModel.selectedReply().value.currentValue(), control: viewModel.selectedControl().value.currentValue(), feature: viewModel.selectedFeature().value.currentValue() };
    };

    var showGetFailAlert = function () {
        viewModel.isCatError(true);
    };

    var CaTFailed = function (status, error) {
        showGetFailAlert();
    };

    var getData = function (url, callback, params) {
        return performRequest('get', url, callback, params ? $.extend(collectTicketInfo(), params) : collectTicketInfo(), CaTFailed);
    };

    var performRequest = function (type, url, callback, params, errorCallback) {
        return $.ajax({
            dataType: "json",
            type: type,
            url: defaultURL + url,
            data: params,
            xhrFields: {
                withCredentials: true
            },
            success: function (data, textStatus, jQxhr) {
                callback(data);
            },
            error: function (jqXhr, textStatus, error) {
                errorCallback(textStatus, error);
            },
        });
    };



    var getReplies = function () {
        return getData('GetReplies', function (data) {
            viewModel.setViewModel(viewModel.selectedReplyModel(), data);
        });
    };

    var getControls = function () {
        return getData('GetControls', function (data) {

            viewModel.setViewModel(viewModel.selectedControlModel(), data);

        });
    };

    var getFeatures = function () {

        return getData('GetFeatures', function (data) {
            viewModel.setViewModel(viewModel.selectedFeatureModel(), data);
        }, { control: viewModel.selectedControl().value.currentValue() });
    };

    var showLoadingPanel = function () {
        //  viewModel.comboBoxVisible(true);
        var panel = $("#ajax_loader");
        var width = firstSeparator.width();
        var height = lastRow.offset().top + lastRow.height() - firstSeparator.offset().top + 30;
        panel.css({ 'width': width + 'px', 'height': height + 'px', 'display': 'flex' });
    };

    var hideLoadingPanel = function () {
        $("#ajax_loader").hide();
    };
    var closeDropdowns = function () {
        $("#select2-drop-mask").remove();
    };

    var reloadCore = function () {
        showLoadingPanel();
        $.when(getReplies(), getControls()).done(function () {
            closeDropdowns();
            getFeatures().always(function () {
                getSuggestions();
                hideLoadingPanel();
                closeDropdowns();
            });
        }).fail(function () {
            closeDropdowns();
            hideLoadingPanel();
        });
    };

    var reloadControls = function () {
        viewModel.calcTotalHistoryItemCount();
        reloadCore();
    };

    var onControlChanged = function () {
        var control = viewModel.selectedControl();
        if (control && control.value) {
            getSuggestions();
            showLoadingPanel();
            getFeatures().always(function () {
                hideLoadingPanel();
            });
        }
    };


    var initLoad = function () {
        reloadCore();
    };
    var addGlobalStyle = function (css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    };

    var productSpan;
    var start = function () {

        addGlobalStyle('.grayedWarning { color:#C4C4C4; }');
        addGlobalStyle('.cat-small-link {font-size:10px; color:gray; padding-right: 8px; }');
        addGlobalStyle('.emptyValue { color:rgb(255,83,47); }');
        addGlobalStyle('.shared { color:#0D47A1; }');
        addGlobalStyle('.team-shared { color:#2E7D32; }');
        addGlobalStyle('.select2-highlighted .shared { color:#BBDEFB; }');
        addGlobalStyle('.select2-highlighted .team-shared { color:#C8E6C9; }');

        var s = $("[name='SelectedProduct']");
        var d = s.prev();
        productSpan = d.find("span:first-child");


        if (!fullViewModel.issueDetails.selectedProduct.value.currentValue()) {
            productSpan.addClass('emptyValue');
        }

        init();
        initLoad();
        fullViewModel.issueDetails.selectedProduct.value.currentValue.subscribe(function (val) {
            if (val) {
                productSpan.removeClass('emptyValue');
            }
            else {
                productSpan.addClass('emptyValue');
            }
            reloadControls();
        }, fullViewModel.issueDetails.selectedProduct.value);
        fullViewModel.issueDetails.selectedCategory.value.currentValue.subscribe(function (val) {
            reloadControls();
        }, fullViewModel.issueDetails.selectedCategory.value);
    };

    start();
});
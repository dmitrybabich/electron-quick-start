$(function() {
    'use strict';

var PostCheckerEditorHandler = function(_item) {
  var self = this;

  self.item = _item;
  self.text = "";

  self.handle = function() { 
    initializeEditor();
    addElements();
  }

  function getEditor() {
    var $postContainer = $('#post-' + self.item.Oid);
    var editorId = $postContainer.find('.tinymce').attr('id');
    return tinyMCE.get(editorId);
  }

  function getText() {
    return getEditor().getContent();
  }

  function getButtonPlaceHolder() {
    var div = $('#post-' + self.item.Oid +' .editing-mode');
    return div;            
  }

  function getButtonContainer() {
    return getButtonPlaceHolder().find(".postchecker");
  }

  function getButton() {
    return getButtonContainer().find("#btn");
  }

  function disableButton(disable) {
    var button = getButton();
    if(button.length)
      button.prop("disabled", disable);    
  }

  function addElements() { 


        function createElements() {
          var button = $("<button></button>");    
          button.addClass("btn");
          var div = $("<div></div>");
          div.addClass("postchecker");
          button.html("Check text");
          button.attr("type", "button");
          button.attr("id", "btn");
          div.append(button);
          getButtonPlaceHolder().append(div);          
          button.click(function() {
            send(); 
          });
        }

        function createCheckStatusDiv(textNotModified, textModified, color) {
            var div = $("<div></div>");
            div.css("color", color);
            div.text(textNotModified);
            //div.attr("data-bind", "text: changesCounter.hasChanges()? '" + textModified + "': '" + textNotModified + "'");            
            return div;
        }



    function send() {

      function preProcessText(text) {
              return text.replace(/\/Thread\/WorkplaceDetails/ig, "https://isc.devexpress.com/Thread/WorkplaceDetails");
            }


      function onSuccess() { 
              console.log('text sent to the server');   
              getButton().siblings().remove();                         
              getButton().remove();
              var div = createCheckStatusDiv("Text was sent successfully", "Save ticket to be able to check this text!", "green");
              getButtonContainer().append(div);  
      }

      function onError(error) { 
              console.log('text sending error:');
              console.log(error);
              var div = createCheckStatusDiv("Error when sending text for checking! See the browser console for details.", "Error when sending text for checking! See the browser console for details.", "red");
              getButtonContainer().append(div);
      }


      function sendTextToServer(text) {
    var urgentTicket = false;   
    if(fullViewModel.issueDetails.urgent)
                urgentTicket = fullViewModel.issueDetails.urgent.value.defaultValue;
              var dataToSend = JSON.stringify({userId : supportCenter.model.ticket.CurrentUserId, ticketLink: window.location.href, text: text, urgent: urgentTicket});
              $.ajax({
                url: 'https://supportserver.corp.devexpress.com/WcfPostCheckerService/PostCheckerService.svc/secure/RegisterNewDialog',
                type: 'POST',
                data: dataToSend,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(result){
                  onSuccess();
                },
                error: function(error) {
                  onError(error);
                }
              });
            }

      function sendCore() {
        var text = getText();
        if(text) {
          text = preProcessText(text);
          sendTextToServer(text);
          disableButton(true);
        }
        else
          log.console("text is empty");
      }



      sendCore();
    }

    createElements();

  }

  function onChanged(isModified) {
    disableButton(isModified);
  }

  function initializeEditor() {
    var editor = getEditor();
    self.text = getText();
    editor.on('Change', function (e) {
      var text = getText();
      onChanged(self.text !== text);
     });

    editor.on('KeyUp', function (e) {
      var text = getText();
      onChanged(self.text !== text);
     });    
  }  
}

var PostCheckerFakeButtonHandler = function(_item) { 
  var self = this;
  self.item = _item;
  
  function getButtonPlaceHolder() {
    var result = $('#newItemPane_QuestionComment_' + self.item.ParentOid + ' .pull-left');
    if(result.length === 0)
      result = $('#newItemPane_AnswerComment_' + self.item.ParentOid + ' .pull-left');
    if(result.length === 0)
      result = $('#newItemPane_Answer' + ' .pull-left');
    return result;
  }

  function buttonExists() {
    return getButtonPlaceHolder().find('.postchecker > #btn').length > 0;
  }

  self.createButton = function() {
    if(!buttonExists()) {
      var button = $("<button></button>");    
      button.addClass("btn");
      var div = $("<div></div>");
      div.addClass("postchecker");
      div.css("margin-top", "5px");
      button.html("Check text");
      button.attr("type", "button");
      button.attr("id", "btn");
      button.prop("disabled", true);
      button.attr("title", "Save the ticket first");
      div.append(button);
      getButtonPlaceHolder().append(div);          
    }
  }
}


$(window).load(function() {
      console.log("DXPostChecker starting");

  $.each(fullViewModel.newItems, function(_, newItem) {
    newItem.isPaneActive.subscribe(function(value) {
      if(value)
        new PostCheckerFakeButtonHandler(newItem).createButton();
    });
  });

  function shouldHandleHistoryItem(issueHistoryItem) { 
    return issueHistoryItem.Draft && issueHistoryItem.Draft.defaultValue;
  }

  $.each(fullViewModel.issueHistoryItems, function (_, issueHistoryItem) {
    if(shouldHandleHistoryItem(issueHistoryItem))
      new PostCheckerEditorHandler(issueHistoryItem).handle();
    if (issueHistoryItem.comments) {
        $.each(issueHistoryItem.comments, function (_, comment) {
          if(shouldHandleHistoryItem(comment))
            new PostCheckerEditorHandler(comment).handle();
        });
    }
  });

  supportCenter.common.changesCounter.hasChanges.subscribe(function(value) {
    //alert(value);
  });

    console.log("DXPostChecker started");

});

});    
class GramHelper {
    setWebView(webView) {

        this.webView = webView;


    }

    setCloseButton(button) {
        this.closeButton = button;
        button.addEventListener('click', () => { this.hide(); });
    }

      setApplyButton(button) {
        this.closeButton = button;
        button.addEventListener('click', () => { this.apply(); });
    }

    setTextJavaScript(text) {
        var script = `var func = function(){
            h = window.textHelper;
            h.setText('${text}');
        };
        func();`;
        return script;
    }
     getTextJavaScript(text) {
        var script = `var func = function(){
            h = window.textHelper;
            return h.getText();
        };
        return func();`;
        return script;
    }

    show(text) {
        this.webView.parentNode.style = "display:initial";
        //         setTimeout(()=>{
        // this.webView.openDevTools();

        //         }, 2000)
        setTimeout(() => { this.webView.executeJavaScript(this.setTextJavaScript(text)); }, 500);
    }

    hide() {
        this.webView.parentNode.style = "display:none";
    }

    apply() {
        var script = this.getTextJavaScript();
        var result = this.webView.executeJavaScript(script);
        alert(result);
        this.hide();
    }
}

module.exports = new GramHelper();
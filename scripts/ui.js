class SnackBar {
    showText(text) {
        this.show({ message: text, timeout: 2000 });
    }
    show(data) {
        //       var data = {
        //   message: 'Button color changed.',
        //   timeout: 2000,
        //   actionHandler: handler,
        //   actionText: 'Undo'
        // };
        var snackbarContainer = document.querySelector('#snackbar');
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
    }
}

module.exports = {
    snackbar: new SnackBar(),
};


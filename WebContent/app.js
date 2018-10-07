Ext.application({
    name: 'app',

    extend: 'app.Application',

    requires: [
        'app.view.Main'
    ],
    
    mainView: 'app.view.Main'
});

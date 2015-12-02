Package.describe({
    name: 'theara:bootstrap-material-datetimepicker',
    version: '0.0.4',
    // Brief, one-line summary of the package.
    summary: '',
    // URL to the Git repository containing the source code for this package.
    git: '',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('1.2.1');
    api.use('ecmascript');

    api.use([
        'jquery',
        'momentjs:moment@2.10.6',
        'fezvrasta:bootstrap-material-design@0.3.0'
    ], 'client');

    api.addFiles([
        'lib/css/bootstrap-material-datetimepicker.css',
        'lib/css/material-icons.css',
        'lib/js/bootstrap-material-datetimepicker.js'
    ], 'client');

    api.addAssets([
        'lib/font/Material-Design-Icons.eot',
        'lib/font/Material-Design-Icons.svg',
        'lib/font/Material-Design-Icons.ttf',
        'lib/font/Material-Design-Icons.woff',
        'lib/font/Material-Design-Icons.woff2'
    ], 'client');
});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('theara:bootstrap-material-datetimepicker');
    api.addFiles('bootstrap-material-datetimepicker-tests.js');
});

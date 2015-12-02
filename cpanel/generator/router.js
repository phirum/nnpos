if (Meteor.isClient) {
    cpanelRoutes.route('/generator', {
        name: 'cpanel.generator',
        action: function (params, queryParams) {
            Layout.generator('cpanel_generator');
        }
    });
}

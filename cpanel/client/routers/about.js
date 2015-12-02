cpanelRoutes.route('/about', {
    name: 'cpanel.about',
    action: function (params, queryParams) {
        Layout.main('cpanel_about');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'About',
        parent: 'cpanel.welcome'
    }
});

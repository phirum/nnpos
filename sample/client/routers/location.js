var subs = new SubsManager();

sampleRoutes.route('/location', {
    name: 'sample.location',
    subscriptions: function (params, queryParams) {
        //this.register('sample_location', subs.subscribe('sample_location'));
    },
    action: function (params, queryParams) {
        Layout.main('sample_location');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Location',
        parent: 'sample.home'
    }
});

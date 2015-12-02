
var subs = new SubsManager();
posRoutes.route('/location', {
    name: 'pos.location',
    subscriptions: function (params, queryParams) {
        this.register(
            'pos_location',
            Meteor.subscribe('posLocation')
        );
    },
    action: function (params, queryParams) {
        Layout.main('pos_location');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Location',
        parent: 'pos.home'
    }
});
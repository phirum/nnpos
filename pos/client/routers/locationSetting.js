
var subs = new SubsManager();
posRoutes.route('/locationSetting', {
    name: 'pos.locationSetting',
    subscriptions: function (params, queryParams) {
        this.register(
            'pos_locationSetting',
            Meteor.subscribe('posLocationSetting')
        );
        this.register(
            'pos_location',
            Meteor.subscribe('posLocation')
        );
    },
    action: function (params, queryParams) {
        Layout.main('pos_locationSetting');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'LocationSetting',
        parent: 'pos.home'
    }
});
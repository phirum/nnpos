
var subs = new SubsManager();
posRoutes.route('/locationSetting', {
    name: 'pos.locationSetting',
    subscriptions: function (params, queryParams) {
        this.register(
            'pos_locationSetting',
            Meteor.subscribe('posLocationSetting',{branchId:Session.get('currentBranch')})
        );
        this.register(
            'pos_location',
            Meteor.subscribe('posLocation',{branchId:Session.get('currentBranch')})
        );
    },
    action: function (params, queryParams) {
        Layout.main('pos_locationSetting',{branchId:Session.get('currentBranch')});
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'LocationSetting',
        parent: 'pos.home'
    }
});
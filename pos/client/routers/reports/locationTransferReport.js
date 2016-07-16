posRoutes.route('/locationTransferReport', {
    name: 'pos.locationTransferReport',
    subscriptions: function (params, queryParams) {
        this.register(
            'pos_staff',
            Meteor.subscribe('posStaff',{})
        );
        this.register(
            'pos_location',
            Meteor.subscribe('posLocation',{})
        );
    },
    action: function (params, queryParams) {
        Layout.main('pos_locationTransferReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'locationTransfer Report',
        parent: 'pos.home'
    }
});

posRoutes.route('/locationTransferReportGen', {
    name: 'pos.locationTransferReportGen',
    action: function (params, queryParams) {
        Layout.report('pos_locationTransferReportGen');
    }
});
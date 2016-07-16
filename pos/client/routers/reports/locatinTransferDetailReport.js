posRoutes.route('/locationTransferDetailReport', {
    name: 'pos.locationTransferDetailReport',
    subscriptions: function (params, queryParams) {
        this.register(
            'pos_staff',
            Meteor.subscribe('posStaff',{})
        );
        this.register(
            'pos_location',
            Meteor.subscribe('posLocation',{})
        );
        /*this.register(
            'pos_category',
            Meteor.subscribe('posCategory',{})
        );*/
    },
    action: function (params, queryParams) {
        Layout.main('pos_locationTransferDetailReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'locationTransferDetail Report',
        parent: 'pos.home'
    }
});

posRoutes.route('/locationTransferDetailReportGen', {
    name: 'pos.locationTransferDetailReportGen',
    action: function (params, queryParams) {
        Layout.report('pos_locationTransferDetailReportGen');
    }
});

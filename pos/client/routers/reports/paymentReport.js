posRoutes.route('/paymentReport', {
    name: 'pos.paymentReport',
    subscriptions: function (params, queryParams) {
        this.register(
            'pos_customer',
            Meteor.subscribe('posCustomer')
        );
        this.register(
            'pos_staff',
            Meteor.subscribe('posStaff')
        );
        this.register(
            'pos_location',
            Meteor.subscribe('posLocation')
        );
    },
    action: function (params, queryParams) {
        Layout.main('pos_paymentReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'payment Report',
        parent: 'pos.home'
    }
});

posRoutes.route('/paymentReportGen', {
    name: 'pos.paymentReportGen',
    action: function (params, queryParams) {
        Layout.report('pos_paymentReportGen');
    }
});
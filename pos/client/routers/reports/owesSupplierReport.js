posRoutes.route('/owesSupplierReport', {
    name: 'pos.owesSupplierReport',
    subscriptions: function (params, queryParams) {
        this.register(
            'pos_supplier',
            Meteor.subscribe('posSupplier')
        );
        this.register(
            'pos_location',
            Meteor.subscribe('posLocation')
        );
    },
    action: function (params, queryParams) {
        Layout.main('pos_owesSupplierReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'OwesSupplier Report',
        parent: 'pos.home'
    }
});

posRoutes.route('/owesSupplierReportGen', {
    name: 'pos.owesSupplierReportGen',
    action: function (params, queryParams) {
        Layout.report('pos_owesSupplierReportGen');
    }
});

posRoutes.route('/stockHistoryReport', {
    name: 'pos.stockHistoryReport',
    subscriptions: function (params, queryParams) {
        this.register(
            'pos_location',
            Meteor.subscribe('posLocation', {})
        );
    },
    action: function (params, queryParams) {
        Layout.main('pos_stockHistoryReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Stock History Report',
        parent: 'pos.home'
    }
});
posRoutes.route('/stockHistoryReportGen', {
    name: 'pos.stockHistoryReportGen',
    action: function (params, queryParams) {
        Layout.report('pos_stockHistoryReportGen');
    }
});

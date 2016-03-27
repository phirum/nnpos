posRoutes.route('/purchasePaymentHistoryReport', {
    name: 'pos.purchasePaymentHistoryReport',
    subscriptions: function (params, queryParams) {
    },
    action: function (params, queryParams) {
        Layout.main('pos_purchasePaymentHistoryReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'purchase Payment History Report',
        parent: 'pos.home'
    }
});

posRoutes.route('/purchasePaymentHistoryReportGen', {
    name: 'pos.purchasePaymentHistoryReportGen',
    action: function (params, queryParams) {
        Layout.report('pos_purchasePaymentHistoryReportGen');
    }
});
posRoutes.route('/salePaymentHistoryReport', {
    name: 'pos.salePaymentHistoryReport',
    subscriptions: function (params, queryParams) {
    },
    action: function (params, queryParams) {
        Layout.main('pos_salePaymentHistoryReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'sale Payment History Report',
        parent: 'pos.home'
    }
});

posRoutes.route('/salePaymentHistoryReportGen', {
    name: 'pos.salePaymentHistoryReportGen',
    action: function (params, queryParams) {
        Layout.report('pos_salePaymentHistoryReportGen');
    }
});
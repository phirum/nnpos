posRoutes.route('/productStockReport', {
    name: 'pos.productStockReport',
    subscriptions: function (params, queryParams) {
    },
    action: function (params, queryParams) {
        Layout.main('pos_productStockReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Product Stock Report',
        parent: 'pos.home'
    }
});

posRoutes.route('/productStockReportGen', {
    name: 'pos.productStockReportGen',
    action: function (params, queryParams) {
        Layout.report('pos_productStockReportGen');
    }
});
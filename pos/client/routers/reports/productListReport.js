posRoutes.route('/productListReport', {
    name: 'pos.productListReport',
    subscriptions: function (params, queryParams) {
    },
    action: function (params, queryParams) {
        Layout.main('pos_productListReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'ProductList Report',
        parent: 'pos.home'
    }
});

posRoutes.route('/productListReportGen', {
    name: 'pos.productListReportGen',
    action: function (params, queryParams) {
        Layout.report('pos_productListReportGen');
    }
});

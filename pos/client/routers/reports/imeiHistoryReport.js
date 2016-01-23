/*
Router.route('pos/saleReport', function () {
    this.render('pos_saleReport');
}, {
    name: 'pos.saleReport',
    header: {title: 'Sale Report', sub: '', icon: 'file-text-o'},
    title:'pos-sale-report'
});

Router.route('pos/saleReportGen', function () {
    this.layout('reportLayout', {
        data: {
            pageSize: 'a4',
            orientation: 'portrait'
        }
    });
    var q = this.params.query;
    this.render('pos_saleReportGen', {
        data: function () {
            return q;
        }
    });

});

*/

posRoutes.route('/imeiHistoryReport', {
    name: 'pos.imeiHistoryReport',
    subscriptions: function (params, queryParams) {
    },
    action: function (params, queryParams) {
        Layout.main('pos_imeiHistoryReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'IMEI History Report',
        parent: 'pos.home'
    }
});

posRoutes.route('/imeiHistoryReportGen', {
    name: 'pos.imeiHistoryReportGen',
    action: function (params, queryParams) {
        Layout.report('pos_imeiHistoryReportGen');
    }
});
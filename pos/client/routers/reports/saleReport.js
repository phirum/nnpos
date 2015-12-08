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

posRoutes.route('/saleReport', {
    name: 'pos.saleReport',
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
        Layout.main('pos_saleReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'sale Report',
        parent: 'pos.home'
    }
});

posRoutes.route('/saleReportGen', {
    name: 'pos.saleReportGen',
    action: function (params, queryParams) {
        Layout.report('pos_saleReportGen');
    }
});
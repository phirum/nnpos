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

posRoutes.route('/saleCollectionReport', {
    name: 'pos.saleCollectionReport',
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
        Layout.main('pos_saleCollectionReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'saleCollection Report',
        parent: 'pos.home'
    }
});

posRoutes.route('/saleCollectionReportGen', {
    name: 'pos.saleCollectionReportGen',
    action: function (params, queryParams) {
        Layout.report('pos_saleCollectionReportGen');
    }
});
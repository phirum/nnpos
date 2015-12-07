/*
Router.route('pos/saleDetailReport', function () {
    this.render('pos_saleDetailReport');
}, {
    name: 'pos.saleDetailReport',
    header: {title: 'Sale Detail Report', sub: '', icon: 'file-text-o'},
    title:'pos-saleDetail-report'
});

Router.route('pos/saleDetailReportGen', function () {
    var q = this.params.query;
    this.layout('reportLayout', {
        data: {
            pageSize: 'a4',
            orientation: 'portrait'
        }
    });

    // Generate
    this.render('pos_saleDetailReportGen', {
        data: function () {
            return q;
        }

    });

});


*/


posRoutes.route('/saleDetailReport', {
    name: 'pos.saleDetailReport',
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
        this.register(
            'pos_category',
            Meteor.subscribe('posCategory')
        );
    },
    action: function (params, queryParams) {
        Layout.main('pos_saleDetailReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'saleDetail Report',
        parent: 'pos.home'
    }
});

posRoutes.route('/saleDetailReportGen', {
    name: 'pos.saleDetailReportGen',
    action: function (params, queryParams) {
        Layout.report('pos_saleDetailReportGen');
    }
});

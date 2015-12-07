/*
Router.route('pos/purchaseDetailReport', function () {
    this.render('pos_purchaseDetailReport');
}, {
    name: 'pos.purchaseDetailReport',
    header: {title: 'Purchase Detail Report', sub: '', icon: 'file-text-o'},
    title:'pos-purchaseDetail-report'
});

Router.route('pos/purchaseDetailReportGen', function () {
    var q = this.params.query;
    this.layout('reportLayout', {
        data: {
            pageSize: 'a4',
            orientation: 'portrait'
        }
    });

    // Generate
    this.render('pos_purchaseDetailReportGen', {
        data: function () {
            return q;
        }

    });

});


*/
posRoutes.route('/purchaseDetailReport', {
    name: 'pos.purchaseDetailReport',
    subscriptions: function (params, queryParams) {
        this.register(
            'pos_supplier',
            Meteor.subscribe('posSupplier')
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
        Layout.main('pos_purchaseDetailReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'purchaseDetail Report',
        parent: 'pos.home'
    }
});

posRoutes.route('/purchaseDetailReportGen', {
    name: 'pos.purchaseDetailReportGen',
    action: function (params, queryParams) {
        Layout.report('pos_purchaseDetailReportGen');
    }
});
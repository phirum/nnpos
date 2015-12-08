/*Router.route('pos/purchaseReport', function () {
        this.render('pos_purchaseReport');
    },
    {
        name: 'pos.purchaseReport',
        header: {title: 'Purchase Report', sub: '', icon: 'file-text-o'},
        title:'pos-purchase-report'
    });
Router.route('pos/purchaseReportGen', function () {
    var q = this.params.query;
    this.layout('reportLayout', {
        data: {
            pageSize: 'a4',
            orientation: 'portrait'
        }
    });
    this.render('pos_purchaseReportGen', {
        data: function () {
            return q;
        }
    });
});*/



posRoutes.route('/purchaseReport', {
    name: 'pos.purchaseReport',
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
    },
    action: function (params, queryParams) {
        Layout.main('pos_purchaseReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'purchase Report',
        parent: 'pos.home'
    }
});

posRoutes.route('/purchaseReportGen', {
    name: 'pos.purchaseReportGen',
    action: function (params, queryParams) {
        Layout.report('pos_purchaseReportGen');
    }
});



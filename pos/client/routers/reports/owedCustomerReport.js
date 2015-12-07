/*
Router.route('pos/owedCustomerReport', function () {
    this.render('pos_owedCustomerReport');
}, {
    name: 'pos.owedCustomerReport',
    header: {title: 'Sale Report', sub: '', icon: 'file-text-o'},
    title:'pos-owedCustomer-report'
});

Router.route('pos/owedCustomerReportGen', function () {
    this.layout('reportLayout', {
        data: {
            pageSize: 'a4',
            orientation: 'portrait'
        }
    });
    var q = this.params.query;
    this.render('pos_owedCustomerReportGen', {
        data: function () {
            return q;
        }
    });

});
*/

posRoutes.route('/owedCustomerReport', {
    name: 'pos.owedCustomerReport',
    subscriptions: function (params, queryParams) {
        this.register(
            'pos_customer',
            Meteor.subscribe('posCustomer')
        );
        this.register(
            'pos_location',
            Meteor.subscribe('posLocation')
        );
    },
    action: function (params, queryParams) {
        Layout.main('pos_owedCustomerReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'OwedCustomer Report',
        parent: 'pos.home'
    }
});

posRoutes.route('/owedCustomerReportGen', {
    name: 'pos.owedCustomerReportGen',
    action: function (params, queryParams) {
        Layout.report('pos_owedCustomerReportGen');
    }
});

/*
Router.route('pos/itemByCustomerReport', function () {
    this.render('pos_itemByCustomerReport');
}, {
    name: 'pos.itemByCustomerReport',
    header: {title: 'Sale Detail Report', sub: '', icon: 'file-text-o'},
    title:'pos-itemByCustomer-report'
});

Router.route('pos/itemByCustomerReportGen', function () {
    var q = this.params.query;
    this.layout('reportLayout', {
        data: {
            pageSize: 'a4',
            orientation: 'portrait'
        }
    });

    // Generate
    this.render('pos_itemByCustomerReportGen', {
        data: function () {
            return q;
        }

    });

});


*/


posRoutes.route('/itemByCustomerReport', {
    name: 'pos.itemByCustomerReport',
    subscriptions: function (params, queryParams) {
        this.register(
            'pos_customer',
            Meteor.subscribe('posCustomer',{})
        );
        this.register(
            'pos_staff',
            Meteor.subscribe('posStaff',{})
        );
        this.register(
            'pos_location',
            Meteor.subscribe('posLocation',{})
        );
    },
    action: function (params, queryParams) {
        Layout.main('pos_itemByCustomerReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'itemByCustomer Report',
        parent: 'pos.home'
    }
});

posRoutes.route('/itemByCustomerReportGen', {
    name: 'pos.itemByCustomerReportGen',
    action: function (params, queryParams) {
        Layout.report('pos_itemByCustomerReportGen');
    }
});

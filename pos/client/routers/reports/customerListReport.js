/*
Router.route('pos/customerListReport', function () {
    this.render('pos_customerListReport');
}, {
    name: 'pos.customerListReport',
    header: {title: 'Sale Report', sub: '', icon: 'file-text-o'},
    title:'pos-customerList-report'
});

Router.route('pos/customerListReportGen', function () {
    this.layout('reportLayout', {
        data: {
            pageSize: 'a4',
            orientation: 'portrait'
        }
    });
    var q = this.params.query;
    this.render('pos_customerListReportGen', {
        data: function () {
            return q;
        }
    });

});

*/

posRoutes.route('/customerListReport', {
    name: 'pos.customerListReport',
    subscriptions: function (params, queryParams) {
        this.register(
            'pos_location',
            Meteor.subscribe('posLocation',{})
        );
    },
    action: function (params, queryParams) {
        Layout.main('pos_customerListReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'customerList Report',
        parent: 'pos.home'
    }
});

posRoutes.route('/customerListReportGen', {
    name: 'pos.customerListReportGen',
    action: function (params, queryParams) {
        Layout.report('pos_customerListReportGen');
    }
});
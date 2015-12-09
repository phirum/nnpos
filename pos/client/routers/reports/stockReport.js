/*
Router.route('pos/stockReport', function () {

    //var role = Roles.userIsInRole(Meteor.userId(), ['reporter'], 'Sample');
    //
    //if (role) {
    this.render('pos_stockReport');
    //} else {
    //    this.redirect('sample.home');
    //    toastr.error('Access denied [403]', 'Error');
    //}

}, {
    name: 'pos.stockReport',
    header: {title: 'Stock balance report', sub: '', icon: 'file-text-o'},
    title:'pos-stock-report'
});

Router.route('pos/stockReportGen', function () {

    var q = this.params.query;
    this.layout('reportLayout', {
        data: {
            pageSize: 'a4',
            orientation: 'portrait'
        }
    });
    this.render('pos_stockReportGen', {
        data: function () {
            return q;
        },
        waitOn: function(){
            return Meteor.subscribe('posStockHistory');
        }
    });

});


*/


posRoutes.route('/stockReport', {
    name: 'pos.stockReport',
    subscriptions: function (params, queryParams) {
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
        Layout.main('pos_stockReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'stock Report',
        parent: 'pos.home'
    }
});

posRoutes.route('/stockReportGen', {
    name: 'pos.stockReportGen',
    action: function (params, queryParams) {
        Layout.report('pos_stockReportGen');
    }
});

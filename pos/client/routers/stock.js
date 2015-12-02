/*
Router.route('pos/stock', function () {
    this.render('pos_stock');
}, {
    name: 'pos.stock',
    header: {title: 'Stock', sub: '', icon: 'list-alt'},
    title:'pos-stock'
});*/


var subs = new SubsManager();
posRoutes.route('/stock', {
    name: 'pos.stock',
    subscriptions: function (params, queryParams) {
        this.register(
            'pos_stock',
            Meteor.subscribe('posStock',{branchId:Session.get('currentBranch')})
        );
    },
    action: function (params, queryParams) {
        Layout.main('pos_stock');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Stock',
        parent: 'pos.home'
    }
});
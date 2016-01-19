/*
Router.route('pos/sale', function () {
    this.render('pos_sale');

}, {
    name: 'pos.sale',
    header: {title: 'sale', sub: '', icon: 'list-alt'},
    waitOn: function () {
        return Meteor.subscribe('posSale');
    },
    title:'pos-sale'
});*/


var subs = new SubsManager();

posRoutes.route('/saleList', {
    name: 'pos.saleList',
    subscriptions: function (params, queryParams) {
        this.register(
            'pos_userStaff',
            Meteor.subscribe('posUserStaff', {branchId: Session.get('currentBranch')})
        );
         /* this.register(
            'pos_saleDetail',
            Meteor.subscribe('posSaleDetail',{branchId:Session.get('currentBranch')})
        );*/
    },
    action: function (params, queryParams) {
        Layout.main('pos_saleList');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'SaleList',
        parent: 'pos.home'
    }
});
/*
 Router.route('pos/salePayment', function () {
 this.render('pos_salePayment');

 }, {
 name: 'pos.salePayment',
 header: {title: 'SalePayment', sub: '', icon: 'list-alt'},
 waitOn: function () {
 return Meteor.subscribe('posSalePayment');
 },
 title:'pos-salePayment'
 });*/

var subs = new SubsManager();
posRoutes.route('/salePayment', {
    name: 'pos.salePayment',
    subscriptions: function (params, queryParams) {
        /* this.register(
         'pos_salePayment',
         Meteor.subscribe('posPayment',{branchId:Session.get('currentBranch')})
         );*/
        /* this.register(
         'pos_sale',
         Meteor.subscribe('posSale', {branchId: Session.get('currentBranch'), status: "Owed"})
         );*/
        /*  this.register(
         'pos_customer',
         Meteor.subscribe('posCustomer', {branchId: Session.get('currentBranch')})
         );*/
        this.register(
            'pos_exchangeRate',
            Meteor.subscribe('posExchangeRate', {branchId: Session.get('currentBranch')})
        );
    },
    action: function (params, queryParams) {
        Layout.main('pos_salePayment');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'SalePayment',
        parent: 'pos.home'
    }
});
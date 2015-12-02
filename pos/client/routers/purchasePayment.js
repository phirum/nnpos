/*
Router.route('pos/purchasePayment', function () {
    this.render('pos_purchasePayment');

}, {
    name: 'pos.purchasePayment',
    header: {title: 'PurchasePayment', sub: '', icon: 'list-alt'},
    waitOn: function () {
        return Meteor.subscribe('posPurchasePayment');
    },
    title:'pos-purchasePayment'
});*/

var subs = new SubsManager();
posRoutes.route('/purchasePayment', {
    name: 'pos.purchasePayment',
    subscriptions: function (params, queryParams) {
        this.register(
            'pos_purchasePayment',
            Meteor.subscribe('posPayment',{branchId:Session.get('currentBranch')})
        );
        this.register(
            'pos_purchase',
            Meteor.subscribe('posPurchase',{branchId:Session.get('currentBranch')})
        );
        this.register(
            'pos_supplier',
            Meteor.subscribe('posSupplier',{branchId:Session.get('currentBranch')})
        );
        this.register(
            'pos_exchangeRate',
            Meteor.subscribe('posExchangeRate',{branchId:Session.get('currentBranch')})
        );
    },
    action: function (params, queryParams) {
        Layout.main('pos_purchasePayment');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'PurchasePayment',
        parent: 'pos.home'
    }
});
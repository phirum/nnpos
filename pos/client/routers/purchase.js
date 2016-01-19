/*
 Router.route('pos/purchase/:purchaseId?', function () {
 this.render('pos_purchase');
 },
 {
 name: 'pos.purchase',
 header: {title: 'Purchase', sub: '', icon: 'money'},
 data:function(){
 var purchaseId=this.params.purchaseId;
 Session.set('purchaseId',purchaseId);
 },
 title:'pos-purchase'
 //template:'purchase',
 //layoutTemplate:'purchaseLayout'

 }
 );

 Router.map(function () {
 this.route('pos/purchase/print/:purchaseId',
 {
 layoutTemplate: 'printLayout',
 // path:'/purchase/:purchaseId',
 name: 'printPurchase',
 data: function () {
 var purchaseId = this.params.purchaseId;
 Session.set('purchaseId', purchaseId);
 },
 template: 'printPurchase',
 title:'pos-purchase-print'
 });
 });
 */

var subs = new SubsManager();
posRoutes.route('/purchaseList', {
    name: 'pos.purchaseList',
    subscriptions: function (params, queryParams) {
        this.register(
            'pos_userStaff',
            Meteor.subscribe('posUserStaff', {branchId: Session.get('currentBranch')})
        );
        /*this.register(
         'pos_purchase',
         subs.subscribe('posPurchase')
         );
         this.register(
         'pos_purchaseDetail',
         subs.subscribe('posPurchaseDetail')
         );*/
    },
    action: function (params, queryParams) {
        Layout.main('pos_purchaseList');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'PurchaseList',
        parent: 'pos.home'
    }
});

var subs = new SubsManager();
posRoutes.route('/purchase/:purchaseId?', {
    name: 'pos.purchase',
    subscriptions: function (params, queryParams) {
        var branchId = Session.get('currentBranch');
        this.register(
            'pos_location',
            Meteor.subscribe('posLocation', {branchId: branchId})
        );
        this.register(
            'pos_purchase',
            Meteor.subscribe('posPurchase', {branchId: branchId, status: "Unsaved"})
        );
        this.register(
            'pos_purchaseDetail',
            Meteor.subscribe('posPurchaseDetail', {branchId: branchId, status: "Unsaved"})
        );
        this.register(
            'pos_staff',
            Meteor.subscribe('posStaff', {branchId: branchId})
        );
        this.register(
            'pos_userStaff',
            Meteor.subscribe('posUserStaff', {branchId: branchId})
        );
        this.register(
            'pos_unit',
            Meteor.subscribe('posUnit')
        );
        this.register(
            'pos_supplier',
            Meteor.subscribe('posSupplier', {branchId: branchId})
        );
        this.register(
            'pos_exchangeRate',
            Meteor.subscribe('posExchangeRate', {branchId: branchId})
        );
    },
    action: function (params, queryParams) {
        Layout.main('pos_purchase');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Purchase',
        parent: 'pos.home'
    }
});

posRoutes.route('/purchase/print/:purchaseId', {
    name: 'pos.printPurchase',
    subscriptions: function (params, queryParams) {
        var branchId = Session.get('currentBranch');
        /* this.register(
         'pos_exchangeRate',
         subs.subscribe('posExchangeRate', {branchId: branchId})
         );*/
    },
    action: function (params, queryParams) {
        Layout.render('printLayout', 'pos_printPurchase');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Purchase',
        parent: 'pos.home'
    }

});
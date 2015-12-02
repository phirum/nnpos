/*
 Router.route('pos/checkout/:saleId?', function () {
 this.render('pos_checkout');
 },
 {
 name: 'pos.checkout',
 header: {title: 'Checkout', sub: '', icon: 'money'},
 data:function(){
 var saleId=this.params.saleId;
 Session.set('saleId',saleId);
 },
 title:'pos-checkout'
 //template:'sale',
 //layoutTemplate:'saleLayout'

 }
 );
 */


var subs = new SubsManager();
posRoutes.route('/checkout/:saleId?', {
    name: 'pos.checkout',
    subscriptions: function (params, queryParams) {
        var branchId=Session.get('currentBranch');
        this.register(
            'pos_location',
            Meteor.subscribe('posLocation',{branchId:branchId})
        );
        this.register(
            'pos_locationSetting',
            Meteor.subscribe('posLocationSetting',{branchId:branchId})
        );
        this.register(
            'pos_sale',
            Meteor.subscribe('posSale',{branchId:branchId})
        );
        this.register(
            'pos_saleDetail',
            Meteor.subscribe('posSaleDetail',{branchId:branchId})
        );
        this.register(
            'pos_product',
            Meteor.subscribe('posProduct')
        );
        this.register(
            'pos_staff',
            Meteor.subscribe('posStaff',{branchId:branchId})
        );
        this.register(
            'pos_userStaff',
            Meteor.subscribe('posUserStaff',{branchId:branchId})
        );
        this.register(
            'pos_customer',
            Meteor.subscribe('posCustomer',{branchId:branchId})
        );
        this.register(
            'pos_exchangeRate',
            Meteor.subscribe('posExchangeRate',{branchId:branchId})
        );
        this.register(
            'pos_stock',
            Meteor.subscribe('posStock',{branchId:branchId})
        );
        this.register(
            'pos_fifoInventory',
            Meteor.subscribe('posFIFOInventory',{branchId:branchId})
        );
        this.register(
            'pos_lifoInventory',
            Meteor.subscribe('posLIFOInventory',{branchId:branchId})
        );
        this.register(
            'pos_averageInventory',
            Meteor.subscribe('posAverageInventory',{branchId:branchId})
        );
    },
    action: function (params, queryParams) {
        Layout.main('pos_checkout');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Checkout',
        parent: 'pos.home'
    }
});

/*
 Router.map(function () {
 this.route('pos/checkout/print/:saleId',
 {
 layoutTemplate: 'printLayout',
 // path:'/checkout/:saleId',
 name: 'print',
 data: function () {
 var saleId = this.params.saleId;
 Session.set('saleId', saleId);
 },
 template: 'print',
 title:'pos-checkout-print'
 });
 });*/



//var subs = new SubsManager();
posRoutes.route('/checkout/print/:saleId', {
    name: 'pos.printCheckout',
    subscriptions: function (params, queryParams) {
        this.register(
            'pos_sale',
            Meteor.subscribe('posSale')
        );
        this.register(
            'pos_saleDetail',
            Meteor.subscribe('posSaleDetail')
        );
        this.register(
            'pos_product',
            Meteor.subscribe('posProduct')
        );
        this.register(
            'pos_staff',
            Meteor.subscribe('posStaff')
        );
        this.register(
            'pos_userStaff',
            Meteor.subscribe('posUserStaff')
        );
        this.register(
            'pos_unit',
            Meteor.subscribe('posUnit')
        );
        this.register(
            'pos_customer',
            Meteor.subscribe('posCustomer')
        );
        this.register(
            'pos_exchangeRate',
            Meteor.subscribe('posExchangeRate')
        );
        this.register(
            'cpanel_company',
            Meteor.subscribe('cpanel_company')
        );
        this.register(
            'cpanel_payment',
            Meteor.subscribe('posPayment')
        );
    },
    action: function (params, queryParams) {
        Layout.render('printLayout','pos_printCheckout');
    },
    layoutTemplate: 'printLayout'
   /* breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Checkout',
        parent: 'pos.home'
    }*/
});
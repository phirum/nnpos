/*
 Router.route('pos/adjustment/:adjustmentId?', function () {
 this.render('pos_adjustment');
 },
 {
 name: 'pos.adjustment',
 header: {title: 'Adjustment', sub: '', icon: 'money'},
 data:function(){
 var adjustmentId=this.params.adjustmentId;
 Session.set('adjustmentId',adjustmentId);
 },
 title:"pos-adjustment"
 }
 );
 */
var subs = new SubsManager();
posRoutes.route('/adjustment/:adjustmentId?', {
    name: 'pos.adjustment',
    subscriptions: function (params, queryParams) {
        var branchId=Session.get('currentBranch');
        this.register(
            'pos_adjustment',
            Meteor.subscribe('posAdjustment',{branchId:branchId})
        );
        this.register(
            'pos_adjustmentDetail',
            Meteor.subscribe('posAdjustmentDetail',{branchId:branchId})
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
            'pos_unit',
            Meteor.subscribe('posUnit',{branchId:branchId})
        );
    },
    action: function (params, queryParams) {
        Layout.main('pos_adjustment');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Adjustment',
        parent: 'pos.home'
    }
});

posRoutes.route('/adjustment/print/:adjustmentId', {
    name: 'pos.printPurchase',
    subscriptions: function (params, queryParams) {
        this.register(
            'pos_adjustment',
            Meteor.subscribe('posSale')
        );
        this.register(
            'pos_adjustmentDetail',
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
    },
    action: function (params, queryParams) {
        Layout.main('pos_printAdjustment');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Adjustment',
        parent: 'pos.home'
    }
});
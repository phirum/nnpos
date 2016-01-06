posRoutes.route('/locationTransfer/:locationTransferId?', {
    name: 'pos.locationTransfer',
    subscriptions: function (params, queryParams) {
        var branchId = Session.get('currentBranch');
        this.register(
            'pos_locationTransfer',
            Meteor.subscribe('posLocationTransfer', {branchId: branchId, status: "Unsaved"})
        );
        this.register(
            'pos_locationTransferDetail',
            Meteor.subscribe('posLocationTransferDetail', {branchId: branchId, status: "Unsaved"})
        );
        /*this.register(
         'pos_product',
         Meteor.subscribe('posProduct')
         );*/
        this.register(
            'pos_staff',
            Meteor.subscribe('posStaff', {branchId: branchId})
        );
        this.register(
            'pos_userStaff',
            Meteor.subscribe('posUserStaff', {branchId: branchId})
        );
        this.register(
            'pos_customer',
            Meteor.subscribe('posCustomer', {branchId: branchId})
        );
        this.register(
            'pos_exchangeRate',
            Meteor.subscribe('posExchangeRate', {branchId: branchId})
        );
        /* this.register(
         'pos_stock',
         Meteor.subscribe('posStock', {branchId: branchId})
         );
         this.register(
         'pos_fifoInventory',
         Meteor.subscribe('posFIFOInventory', {branchId: branchId})
         );
         this.register(
         'pos_lifoInventory',
         Meteor.subscribe('posLIFOInventory', {branchId: branchId})
         );
         this.register(
         'pos_averageInventory',
         Meteor.subscribe('posAverageInventory', {branchId: branchId})
         );*/
        this.register(
            'pos_location',
            Meteor.subscribe('posLocation')
        );
    },
    action: function (params, queryParams) {
        Layout.main('pos_locationTransfer');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'LocationTransfer',
        parent: 'pos.home'
    }
});

posRoutes.route('/locationTransfer/print/:locationTransferId', {
    name: 'pos.printLocationTransfer',
    subscriptions: function (params, queryParams) {
        this.register(
            'pos_locationTransfer',
            Meteor.subscribe('posLocationTransfer')
        );
        this.register(
            'pos_locationTransferDetail',
            Meteor.subscribe('posLocationTransferDetail')
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
            'pos_location',
            Meteor.subscribe('posLocation')
        );
    },
    action: function (params, queryParams) {
        Layout.render('printLayout', 'pos_printLocationTransfer');
    },
    layoutTemplate: 'printLayout'
    /* breadcrumb: {
     //params: ['id'],
     //queryParams: ['show', 'color'],
     title: 'LocationTransfer',
     parent: 'pos.home'
     }*/
});
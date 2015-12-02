/**
 * Module
 */
Module = typeof Module === 'undefined' ? {} : Module;
Meteor.isClient && Template.registerHelper('Module', Module);

Module.Pos = {
    name: 'POS System',
    version: '0.0.1',
    summary: 'POS System is used for Sale Product: Point of Sale.',
    roles: [
        'admin',
        'general',
        'reporter',
        'seller'
    ],
    dump: {
        setting: [
            'Pos.Collection.Categories',
            'Pos.Collection.Units',
            'Pos.Collection.Products'
        ],
        data: [
            'Pos.Collection.ExchangeRates',
            'Pos.Collection.Customers',
            'Pos.Collection.Suppliers',
            'Pos.Collection.Staffs',
            'Pos.Collection.UserStaffs',
            'Pos.Collection.Sales',
            'Pos.Collection.SaleDetails',
            'Pos.Collection.Purchases,',
            'Pos.Collection.PurchaseDetails',
            'Pos.Collection.Promotions',
            'Pos.Collection.PromotionPercentages',
            'Pos.Collection.PromotionQuantities',
            'Pos.Collection.Payments',
            'Pos.Collection.Locations',
            'Pos.Collection.LocationSettings',
            'Pos.Collection.LocationTransfers',
            'Pos.Collection.FIFOInventory'
        ]
    }
};

/*Router.route('pos/product', function () {
    this.render('pos_product');

}, {
    name: 'pos.product',
    header: {title: 'product', sub: '', icon: 'list-alt'},
    waitOn: function () {
        return Meteor.subscribe('posProduct');
    },
    title:'pos-product'
});*/



var subs = new SubsManager();
posRoutes.route('/promotionQty', {
    name: 'pos.promotionQty',
    subscriptions: function (params, queryParams) {
        this.register(
            'pos_promotionQty',
            Meteor.subscribe('posPromotionQty')
        );
    },
    action: function (params, queryParams) {
        Layout.main('pos_promotionQty');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Promotion Quantity',
        parent: 'pos.home'
    }
});


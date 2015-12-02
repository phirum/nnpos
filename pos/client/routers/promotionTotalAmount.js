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
posRoutes.route('/promotionTotalAmount', {
    name: 'pos.promotionTotalAmount',
    subscriptions: function (params, queryParams) {
        this.register(
            'pos_promotionTotalAmount',
            Meteor.subscribe('posPromotionTotalAmount')
        );
    },
    action: function (params, queryParams) {
        Layout.main('pos_promotionTotalAmount');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Promotion Total Amount',
        parent: 'pos.home'
    }
});


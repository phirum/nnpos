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
posRoutes.route('/promotionPercentage', {
    name: 'pos.promotionPercentage',
    subscriptions: function (params, queryParams) {
        this.register(
            'pos_promotionPercentage',
            Meteor.subscribe('posPromotionPercentage')
        );
    },
    action: function (params, queryParams) {
        Layout.main('pos_promotionPercentage');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Promotion Percentage',
        parent: 'pos.home'
    }
});


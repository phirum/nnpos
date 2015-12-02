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
posRoutes.route('/promotion', {
    name: 'pos.promotion',
    subscriptions: function (params, queryParams) {
        this.register(
            'pos_promotion',
            Meteor.subscribe('posPromotion')
        );
    },
    action: function (params, queryParams) {
        Layout.main('pos_promotion');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Promotion',
        parent: 'pos.home'
    }
});


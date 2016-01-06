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
posRoutes.route('/product', {
    name: 'pos.product',
    subscriptions: function (params, queryParams) {
        this.register(
            'pos_image',
            Meteor.subscribe('images')
        );
        /*
         this.register(
         'pos_product',
         Meteor.subscribe('posProduct')
         );*/
        this.register(
            'pos_category',
            Meteor.subscribe('posCategory')
        );
        this.register(
            'pos_unit',
            Meteor.subscribe('posUnit')
        );
    },
    action: function (params, queryParams) {
        Layout.main('pos_product');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Product',
        parent: 'pos.home'
    }
});


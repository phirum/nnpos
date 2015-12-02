/*Router.route('pos/category', function () {
    this.render('pos_category');

}, {
    name: 'pos.category',
    header: {title: 'Category', sub: '', icon: 'list-alt'},
    waitOn: function () {
        return Meteor.subscribe('posCategory');
    },
    title:'pos-category'
});*/

var subs = new SubsManager();

posRoutes.route('/category', {
    name: 'pos.category',
    subscriptions: function (params, queryParams) {
        this.register(
            'pos_category',
            Meteor.subscribe('posCategory')
        );
    },
    action: function (params, queryParams) {
        Layout.main('pos_category');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Category',
        parent: 'pos.home'
    }
});

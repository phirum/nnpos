/*
Router.route('pos/subCategory', function () {
    this.render('pos_subCategory');

}, {
    name: 'pos.subCategory',
    header: {title: 'subCategory', sub: '', icon: 'list-alt'},
    waitOn: function () {
        return Meteor.subscribe('posSubCategory');
    },
    title:'pos-sub Category'
});*/



var subs = new SubsManager();

posRoutes.route('/subCategory', {
    name: 'pos.subCategory',
    subscriptions: function (params, queryParams) {
        this.register(
            'pos_subCategory',
            Meteor.subscribe('posSubCategory')
        );
        this.register(
            'pos_category',
            Meteor.subscribe('posCategory')
        );
    },
    action: function (params, queryParams) {
        Layout.main('pos_subCategory');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'SubCategory',
        parent: 'pos.home'
    }
});
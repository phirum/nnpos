/*
Router.route('pos/unit', function () {
    this.render('pos_unit');

}, {
    name: 'pos.unit',
    header: {title: 'unit', sub: '', icon: 'list-alt'},
    waitOn: function () {
        return Meteor.subscribe('posUnit');
    },
    title:'pos-unit'
});*/


var subs = new SubsManager();
posRoutes.route('/unit', {
    name: 'pos.unit',
    subscriptions: function (params, queryParams) {
     this.register(
     'pos_unit',
     Meteor.subscribe('posUnit')
     );
     },
    action: function (params, queryParams) {
        Layout.main('pos_unit');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Unit',
        parent: 'pos.home'
    }
});
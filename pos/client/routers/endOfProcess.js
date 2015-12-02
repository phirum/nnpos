/*
Router.route('pos/endOfProcess', function () {
    this.render('pos_endOfProcess');
}, {
    name: 'pos.endOfProcess',
    header: {title: 'EndOfProcess', sub: '', icon: 'list-alt'},
    title:'pos-end of process'
});*/


//var subs = new SubsManager();

posRoutes.route('/endOfProcess', {
    name: 'pos.endOfProcess',
    /* subscriptions: function (params, queryParams) {
        this.register(
            'pos_customer',
            Meteor.subscribe('posCustomer')
        );
    },*/
    action: function (params, queryParams) {
        Layout.main('pos_endOfProcess');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'EndOfProcess',
        parent: 'pos.home'
    }
});


var subs = new SubsManager();
posRoutes.route('/customerLocation', {
    name: 'pos.customerLocation',
    subscriptions: function (params, queryParams) {
        this.register(
            'pos_customerLocation',
            Meteor.subscribe('posCustomerLocation')
        );
    },
    action: function (params, queryParams) {
        Layout.main('pos_customerLocation');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'CustomerLocation',
        parent: 'pos.home'
    }
});
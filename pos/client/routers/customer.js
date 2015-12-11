/*
Router.route('pos/customer', function () {
    this.render('pos_customer');

}, {
    name: 'pos.customer',
    header: {title: 'Customer', sub: '', icon: 'list-alt'},
    waitOn: function () {
        return Meteor.subscribe('posCustomer');
    },
    title:'pos-customer'
});
*/


var subs = new SubsManager();

posRoutes.route('/customer', {
    name: 'pos.customer',
    subscriptions: function (params, queryParams) {
        this.register(
            'pos_customer',
            Meteor.subscribe('posCustomer',{branchId:Session.get('currentBranch')})
        );
        this.register(
            'pos_location',
            Meteor.subscribe('posLocation',{branchId:Session.get('currentBranch')})
        );
    },
    action: function (params, queryParams) {
        Layout.main('pos_customer');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Customer',
        parent: 'pos.home'
    }
});
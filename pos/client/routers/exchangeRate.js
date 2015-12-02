/*
 FlowRouter.route('pos/exchangeRate', function () {
 this.render('pos_exchangeRate');
 }, {
 name: 'pos.exchangeRate',
 header: {title: 'exchangeRate', sub: '', icon: 'list-alt'},
 waitOn: function () {
 return Meteor.subscribe('posExchangeRate');
 },
 title:'pos-exchange rate'
 });*/

posRoutes.route('/exchangeRate', {
    name: 'pos.exchangeRate',
    subscriptions: function (params, queryParams) {
        this.register(
            'pos_exchangeRate',
            Meteor.subscribe('posExchangeRate', {branchId:Session.get('currentBranch')})
        );
    },
    action: function (params, queryParams) {
        Layout.main('pos_exchangeRate');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'ExchangeRate',
        parent: 'pos.home'
    }
});

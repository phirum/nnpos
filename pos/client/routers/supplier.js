/*
 Router.route('pos/supplier', function () {
 this.render('pos_supplier');

 }, {
 name: 'pos.supplier',
 header: {title: 'supplier', sub: '', icon: 'list-alt'},
 waitOn: function () {
 return Meteor.subscribe('posSupplier');
 },
 title:'pos-supplier'
 });*/


var subs = new SubsManager();
posRoutes.route('/supplier', {
    name: 'pos.supplier',
    subscriptions: function (params, queryParams) {
        this.register(
            'pos_supplier',
            Meteor.subscribe('posSupplier', {branchId: Session.get('currentBranch')})
        );
    },
    action: function (params, queryParams) {
        Layout.main('pos_supplier');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Supplier',
        parent: 'pos.home'
    }
});
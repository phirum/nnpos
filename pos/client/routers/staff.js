/*
Router.route('pos/staff', function () {
    this.render('pos_staff');

}, {
    name: 'pos.staff',
    header: {title: 'staff', sub: '', icon: 'list-alt'},
    waitOn: function () {
        return Meteor.subscribe('posStaff');
    },
    title:'pos-staff'
});*/

var subs = new SubsManager();
posRoutes.route('/staff', {
    name: 'pos.staff',
    subscriptions: function (params, queryParams) {
        this.register(
            'pos_staff',
            Meteor.subscribe('posStaff',{branchId:Session.get('currentBranch')})
        );
    },
    action: function (params, queryParams) {
        Layout.main('pos_staff');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Staff',
        parent: 'pos.home'
    }
});
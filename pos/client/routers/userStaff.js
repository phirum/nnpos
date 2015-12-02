/*
 Router.route('pos/userStaff', function () {
 this.render('pos_userStaff');

 }, {
 name: 'pos.userStaff',
 header: {title: 'User Staff Mapping', sub: '', icon: 'list-alt'},
 waitOn: function () {
 return Meteor.subscribe('posUserStaff');
 },
 title:'pos-user-staff'
 });*/

var subs = new SubsManager();
posRoutes.route('/userStaff', {
    name: 'pos.userStaff',
    subscriptions: function (params, queryParams) {
        this.register(
            'pos_userStaff',
            Meteor.subscribe('posUserStaff', {branchId: Session.get('currentBranch')})
        );
        this.register(
            'pos_userStaff',
            Meteor.subscribe('posStaff', {branchId: Session.get('currentBranch')})
        );
    },
    action: function (params, queryParams) {
        Layout.main('pos_userStaff');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'UserStaff',
        parent: 'pos.home'
    }
});
/*
Router.route('pos/locationTransfer', function () {
    this.render('pos_locationTransfer');

}, {
    name: 'pos.locationTransfer',
    header: {title: 'locationTransfer', sub: '', icon: 'list-alt'},
    waitOn: function () {
        return Meteor.subscribe('posLocationTransfer');
    },
    title:'pos-locationTransfer'
});*/


var subs = new SubsManager();

posRoutes.route('/locationTransferList', {
    name: 'pos.locationTransferList',
    subscriptions: function (params, queryParams) {
        /*this.register(
            'pos_locationTransfer',
            Meteor.subscribe('posLocationTransfer',{branchId:Session.get('currentBranch')})
        );
        this.register(
            'pos_locationTransferDetail',
            Meteor.subscribe('posLocationTransferDetail',{branchId:Session.get('currentBranch')})
        );*/
    },
    action: function (params, queryParams) {
        Layout.main('pos_locationTransferList');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'LocationTransferList',
        parent: 'pos.home'
    }
});
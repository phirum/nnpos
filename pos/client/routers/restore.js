//Router.route('pos/restore', function () {
//    this.render('pos_restore');
//}, {
//    name: 'pos.restore',
//    header: {title: 'restore', sub: '', icon: 'files-o'},
//    title:'pos-restore'
//});


var subs = new SubsManager();
posRoutes.route('/restore', {
    name: 'pos.restore',
    /* subscriptions: function (params, queryParams) {
     this.register(
     'pos_backup',
     Meteor.subscribe('posBackup')
     );
     },*/
    action: function (params, queryParams) {
        Layout.main('pos_restore');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Restore',
        parent: 'pos.home'
    }
});
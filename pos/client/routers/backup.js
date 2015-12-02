/*
Router.route('pos/backup', function () {
    this.render('pos_backup');
}, {
    name: 'pos.backup',
    header: {title: 'Backup', sub: '', icon: 'files-o'},
    title:'pos-backup'
});*/

var subs = new SubsManager();
posRoutes.route('/backup', {
    name: 'pos.backup',
   /* subscriptions: function (params, queryParams) {
        this.register(
            'pos_backup',
            Meteor.subscribe('posBackup')
        );
    },*/
    action: function (params, queryParams) {
        Layout.main('pos_backup');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Backup',
        parent: 'pos.home'
    }
});
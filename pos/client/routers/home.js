/*Router.route('pos/home', function () {

    this.render('pos_home');

}, {
    name: 'pos.home',
    header: {title: 'home', sub: '', icon: 'home'},
    title:'pos-home'
});*/


posRoutes.route('/home', {
    name: 'pos.home',
    action: function (params, queryParams) {
        Layout.main('pos_home');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Home'
        //parent: 'Home'
    }
});



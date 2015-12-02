var subs = new SubsManager();

sampleRoutes.route('/order/:customerId', {
    name: 'sample.order',
    subscriptions: function (params, queryParams) {
        // Order
        //this.register(
        //    'sample_orderByCustomer',
        //    subs.subscribe('sample_orderByCustomer', params.customerId)
        //);
    },
    action: function (params, queryParams) {
        Layout.main('sample_order');
    },
    breadcrumb: {
        params: ['customerId'],
        //queryParams: ['show', 'color'],
        title: 'Order',
        parent: 'sample.customer'
    }
});

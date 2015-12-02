Cpanel.TabularTable.Exchange = new Tabular.Table({
    name: "cpanelExchangeList",
    collection: Cpanel.Collection.Exchange,
    pagingType: "full_numbers",
    autoWidth: false,
    columnDefs: [
        {"width": "12px", "targets": 0}
    ],
    order: [['1', 'desc']],
    columns: [
        {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.cpanel_exchangeAction},
        {
            data: "exDate",
            title: "Date",
            render: function (val, type, doc) {
                return moment(val).format('YYYY-MM-DD');
            }
        },
        {data: "base", title: "Base Currency"},
        {
            data: "rates",
            title: "Rates",
            render: function (val, type, doc) {
                return JSON.stringify(val);
            }
        }
    ]
});
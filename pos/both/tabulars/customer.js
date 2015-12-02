Pos.TabularTable.Customers = new Tabular.Table({
    name: "posCustomerList",
    collection: Pos.Collection.Customers,
    columns: [
        {
            title: '<i class="fa fa-bars"></i>',
            tmpl: Meteor.isClient && Template.pos_customerAction
        },
        {data: "_id", title: "ID"},
        {data: "name", title: "Name"},
        {data: "gender", title: "Gender"},
        {data: "phone", title: "Phone"},
        {data: "address", title: "Address"},
        {
            data: "_saleCount", title: "Has Bought",
            render: function (val, type, doc) {
                return val == null ? 0 : val;
            }
        }
    ],
    order: [['1', 'desc']],
    columnDefs: [
        {"width": "12px", "targets": 0}
    ]
});

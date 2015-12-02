Pos.TabularTable.Suppliers = new Tabular.Table({
    name: "posSupplierList",
    collection: Pos.Collection.Suppliers,
    columns: [
        {
            title: '<i class="fa fa-bars"></i>',
            tmpl: Meteor.isClient && Template.pos_supplierAction
        },
        {data: "_id", title: "ID"},
        {data: "name", title: "Name"},
        {data: "phone", title: "Phone"},
        {data: "address", title: "Address"},
        {
            data: "_purchaseCount", title: "Has supplied",
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

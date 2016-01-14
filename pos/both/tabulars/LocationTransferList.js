Pos.TabularTable.LocationTransfers = new Tabular.Table({
    name: "posLocationTransferList",
    collection: Pos.Collection.LocationTransfers,
    columns: [
        {
            title: '<i class="fa fa-bars"></i>',
            tmpl: Meteor.isClient && Template.pos_locationTransferAction
        },
        {data: "_id", title: "ID"},
        {
            data: "locationTransferDate", title: "LocationTransfer Date",
            render: function (val, type, doc) {
                return moment(val).format("DD-MM-YYYY HH:mm");
            }
        },
        {data: "_staff.name", title: "Staff"},
        {data: "status", title: "Status"},
        {data: "_fromLocation.name", title: "From"},
        {data: "_toLocation.name", title: "To"}
    ],
    order: [['1', 'desc']]
    ,
    columnDefs: [
        {"width": "12px", "targets": 0}
    ],
    extraFields: ['_paymentCount']
});

Pos.TabularTable.Purchases = new Tabular.Table({
    name: "posPurchaseList",
    collection: Pos.Collection.Purchases,
    columns: [
        {
            title: '<i class="fa fa-bars"></i>',
            tmpl: Meteor.isClient && Template.pos_purchaseAction
        },
        {data: "_id", title: "ID"},
        {
            data: "purchaseDate", title: "Purchase Date",
            render: function (val, type, doc) {
                return moment(val).format("DD-MM-YYYY HH:mm");
            }
        },
        {data: "_supplier.name", title: "Supplier"},
        {data: "_staff.name", title: "Staff"},
        {data: "total", title: "Total"},
        {
            data: "status", title: "Status",
            render: function (val, type, doc) {
                if(val=='Unsaved'){
                    return "<p class='label label-danger'>"+val+"</p>";
                }else if(val=='Owed'){
                    return "<p class='label label-warning'>"+val+"</p>";
                }else{
                    return "<p class='label label-success'>"+val+"</p>";
                }
            }
        },
        {data: "owedAmount", title: "Owed"},
        {data: "transactionType", title: "Purchase Type"}
    ],
    order: [['1', 'desc']],
    columnDefs: [
        {"width": "12px", "targets": 0}
    ],
    extraFields: ['_paymentCount']
});

Pos.TabularTable.Sales = new Tabular.Table({
    name: "posSaleList",
    collection: Pos.Collection.Sales,
    columns: [
        {
            title: '<i class="fa fa-bars"></i>',
            tmpl: Meteor.isClient && Template.pos_saleAction
        },
        {data: "_id", title: "ID"},
        {data: "voucher", title: "Voucher"},
        {
            data: "saleDate", title: "Sale Date",
            render: function (val, type, doc) {
                return moment(val).format("DD-MM-YYYY HH:mm");
            }
        },
        {data: "_customer.name", title: "Customer"},
        {data: "_staff.name", title: "Staff"},
        {data: "totalCost", title: "Total Cost"},
        {data: "total", title: "Total"},
        //{data: "paidAmount", title: "Paid"},
        {data: "owedAmount", title: "Owed"},
        {
            data: "status", title: "Status",
            render: function (val, type, doc) {
                if (val == 'Unsaved') {
                    return "<p class='label label-danger'>" + val + "</p>";
                } else if (val == 'Owed') {
                    return "<p class='label label-warning'>" + val + "</p>";
                } else {
                    return "<p class='label label-success'>" + val + "</p>";
                }
            }
        },
        {
            data: "isRetail", title: "Invoice Type",
            render: function (val, type, doc) {
                return val ? "Retail" : "Wholesale";
            }
        },
        {data: "transactionType", title: "Sale Type"}


    ],
    order: [['1', 'desc']]
    ,
    columnDefs: [
        {"width": "12px", "targets": 0}
    ],
    extraFields: ['_paymentCount']
});

Pos.TabularTable.SalePayments = new Tabular.Table({
    name: "posSalePaymentList",
    collection: Pos.Collection.Payments,
    columns: [

        {
            title: '<i class="fa fa-bars"></i>',
            tmpl: Meteor.isClient && Template.pos_salePaymentAction
        },
        {data: "_id", title: "ID"},
        {data: "saleId", title: "Sale ID"},
        {data: "_sale._customer.name", title: "Customer Name"},
        {
            data: "paymentDate", title: "Date",
            render: function (val, type, doc) {
                return moment(val).format("DD-MM-YYYY");
            }
        },
        {data: "dueAmount", title: "Due"},
        {data: "payAmount", title: "Paid"},
        {data: "balanceAmount", title: "Balance"},
        {
            data: "payments", title: "Payment",
            render: function (val, type, doc) {
                return JSON.stringify(val);
            }
        },
        {data: "status", title: "Status"},
        {data: "_branch.enName", title: "Branch"}
    ],
    order: [['1', 'desc']]
    ,
    columnDefs: [
        {"width": "12px", "targets": 0}
    ]
});

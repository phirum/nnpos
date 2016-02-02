Pos.Collection.Payments = new Mongo.Collection("pos_payments");
Pos.Schema.Payments = new SimpleSchema({
    customerId: {
        type: String,
        label: "Customer",
        /*   autoform: {
         type: "select2",
         options: function () {
         return Pos.List.customerList();
         }
         }*/
    },
    saleId: {
        type: String,
        label: "SaleId"
        /* autoform: {
         type: "select2",
         options: function () {
         return Pos.List.saleList()
         }
         }*/
    },
    paymentDate: {
        type: Date,
        label: "Payment Date"
    },
    payAmount: {
        type: Number,
        label: "Pay Amount",
        decimal: true
    },
    dueAmount: {
        type: Number,
        label: "Due Amount",
        decimal: true
    },
    balanceAmount: {
        type: Number,
        label: "Balance Amount",
        decimal: true
    },
    branchId: {
        type: String,
        label: "Branch"
    },
    status: {
        type: String,
        label: "status"
    },
    payment: {
        type: [Object],
        label: "Payment",
        blackbox: true
    }

});
//Pos.Collection.Payments.attachSchema(Pos.Schema.Payments);

Pos.Collection.PurchasePayments = new Mongo.Collection("pos_purchasePayments");
Pos.Schema.PurchasePayments = new SimpleSchema({
    supplierId: {
        type: String,
        label: "Supplier",
        optional: true
    },
    purchaseId: {
        type: String,
        label: "PurchaseId"
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
    payments: {
        type: [Object],
        label: "Payment",
        blackbox: true
    }
});
Pos.Collection.PurchasePayments.attachSchema(Pos.Schema.PurchasePayments);

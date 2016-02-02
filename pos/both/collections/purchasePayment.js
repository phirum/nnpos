Pos.Collection.PurchasePayments = new Mongo.Collection("pos_purchasePayments");
Pos.Schema.PurchasePayments = new SimpleSchema({
    supplierId: {
        type: String,
        label: "Supplier",
       /* autoform: {
            type: "select2",
            options: function () {
                return Pos.List.supplierList();
            }
        }*/
    },
    purchaseId: {
        type: String,
        label: "PurchaseId",
       /* autoform: {
            type: "select2",
            options: function () {
                return Pos.List.purchaseList()
            }
        }*/
    },
    paymentDate: {
        type: String,
        label: "Payment Date"
    },
    payment: {
        type: [Object],
        label: "Payment",
        blackbox: true
    }
});
//Pos.Collection.PurchasePayments.attachSchema(Pos.Schema.PurchasePayments);

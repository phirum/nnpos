Pos.Collection.Payments = new Mongo.Collection("pos_payments");
Pos.Schema.Payments = new SimpleSchema({
    customerId: {
        type: String,
        label: "Customer",
        autoform: {
            type: "select2",
            options: function () {
                return Pos.List.customerList();
            }
        }
    },
    saleId: {
        type: String,
        label: "SaleId",
        autoform: {
            type: "select2",
            options: function () {
                return Pos.List.saleList()
            }
        }
    },
    paymentDate: {
        type: String,
        label: "Payment Date"
    }
});
//Pos.Collection.Payments.attachSchema(Pos.Schema.Payments);

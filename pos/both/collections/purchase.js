Pos.Collection.Purchases = new Mongo.Collection("pos_purchases");
Pos.Schema.Purchases = new SimpleSchema({
    purchaseDate: {
        type: Date,
        label: "Sale Date"
    },
    discount: {
        type: Number,
        label: "Discount",
        decimal: true
    },
    subTotal: {
        type: Number,
        label: "SubTotal",
        decimal: true
    },
    total: {
        type: Number,
        label: "Total",
        decimal: true
    },
    staffId: {
        type: String,
        label: "Staff"
        //regEx: /^[a-z0-9A-Z_]{3,15}$/
    },
    status: {
        type: String,
        label: "Status"
    },
    supplierId: {
        type: String,
        label: "Supplier"
    },
    transactionType: {
        type: String,
        label: "Transaction Type"
    },
    description:{
        type:String,
        label:"Description",
        optional:true
    }
});
Pos.Collection.Purchases.attachSchema(Pos.Schema.Purchases);


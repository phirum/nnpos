Pos.Collection.SaleDetails = new Mongo.Collection("pos_saleDetails");
Pos.Schema.SaleDetails = new SimpleSchema({
    saleId: {
        type: String,
        label: "Sale"
    },
    productId: {
        type: String,
        label: "Product"
    },
    imei: {
        type: [String],
        label: "IMEI",
        optional: true
    },
    price: {
        type: Number,
        label: "Price",
        decimal: true
    },
    discount: {
        type: Number,
        label: "Discount",
        decimal: true
    },
    quantity: {
        type: Number,
        label: "Quantity"
    },
    amount: {
        type: Number,
        label: "Amount",
        decimal: true
    },
    transaction: {
        type: [Object],
        label: "Transaction",
        blackbox: true,
        optional:true
    },
    totalCost: {
        type: Number,
        label: "Total Cost",
        decimal: true,
        optional: true
    },
    status: {
        type: String,
        label: "Status"
    },
    locationId: {
        type: String,
        label: "Location"
    },
    branchId: {
        type: String,
        label: "Branch"
    }
});
Pos.Collection.SaleDetails.attachSchema(Pos.Schema.SaleDetails);


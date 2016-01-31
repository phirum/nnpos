Pos.Collection.PurchaseDetails = new Mongo.Collection("pos_purchaseDetails");
Pos.Schema.PurchaseDetails = new SimpleSchema({
    purchaseId: {
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
Pos.Collection.PurchaseDetails.attachSchema(Pos.Schema.PurchaseDetails);


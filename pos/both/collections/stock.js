Pos.Collection.Stocks = new Mongo.Collection("pos_stocks");
Pos.Collection.FIFOInventory = new Mongo.Collection('pos_fifoInventory');
Pos.Collection.LIFOInventory = new Mongo.Collection('pos_lifoInventory');
Pos.Collection.AverageInventory = new Mongo.Collection('pos_averageInventory');

Pos.Schema.FIFOInventory = new SimpleSchema({
    productId: {
        type: String,
        label: "Product"
    },
    branchId: {
        type: String,
        label: "Branch"
    },
    locationId: {
        type: String,
        label: "Location"
    },
    quantity: {
        type: Number,
        label: "Quantity"
    },
    price: {
        type: Number,
        label: "Price",
        decimal: true
    },
    remainQty: {
        type: Number,
        label: "Status"
    },
    isSale: {
        type: Boolean,
        label: "Phone"
    },
    imei: {
        type: [String],
        label: "Branch",
        optional: true
    }
});
Pos.Collection.FIFOInventory.attachSchema(Pos.Schema.FIFOInventory);

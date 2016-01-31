Pos.Collection.LocationTransferDetails = new Mongo.Collection("pos_locationTransferDetails");
Pos.Schema.LocationTransferDetails = new SimpleSchema({
    locationTransferId: {
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
    quantity: {
        type: Number,
        label: "Quantity"
    },
    fromLocationId: {
        type: String,
        label: "From Location"
    },
    toLocationId:{
        type:String,
        label:"To Location"
    },
    branchId: {
        type: String,
        label: "Branch"
    },
    status:{
        type:String,
        label:"Status"
    },
    transaction:{
        type:[Object],
        label:"Transaction",
        optional:true,
        blackbox:true
    }
});
Pos.Collection.LocationTransferDetails.attachSchema(Pos.Schema.LocationTransferDetails);


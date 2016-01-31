Pos.Collection.LocationTransfers = new Mongo.Collection("pos_locationTransfers");
Pos.Schema.LocationTransfers = new SimpleSchema({
    locationTransferDate: {
        type: Date,
        label: "Location Transfer Date"
    },
    staffId: {
        type: String,
        label: "Staff"
        //regEx: /^[a-z0-9A-Z_]{3,15}$/
    },
    fromLocationId: {
        type: String,
        label: "From Location"
    },
    toLocationId: {
        type: String,
        label: "To Location"
    },
    status: {
        type: String,
        label: "Status"
    },
    branchId: {
        type: String,
        label: "Branch"
    }
});
Pos.Collection.LocationTransfers.attachSchema(Pos.Schema.LocationTransfers);



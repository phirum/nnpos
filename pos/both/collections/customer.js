Pos.Collection.Customers = new Mongo.Collection("pos_customers");
Pos.Schema.Customers = new SimpleSchema({
    customerId:{
        type:"String",
        label:"ID",
        optional:true
    },
    name: {
        type: String,
        label: "Name",
        unique: true,
        max: 200
    },
    customerLocationId: {
        type: String,
        optional: true,
        label: "Customer Location",
        autoform: {
            type: "select2",
            options: function () {
                return Pos.List.customerLocations();
            }
        }
    },
    locationId: {
        type: String,
        label: "Location",
        autoform: {
            type: "select2",
            options: function () {
                return Pos.List.locations();
            }
        },
        optional: true
    },
    gender: {
        type: String,
        label: "Gender",
        autoform: {
            type: "select2",
            options: function () {
                return Pos.List.gender();
            }
        }
    },
    phone: {
        type: String,
        label: "Phone",
        optional: true
    },
    address: {
        type: String,
        label: "Address",
        autoform: {
            afFieldInput: {
                type: "textarea"
            }
        },
        optional: true
    },
    branchId: {
        type: String,
        label: "Branch"
    },
    _branch: {
        type: Object,
        blackbox: true,
        optional: true
    },
    _saleCount: {
        type: Number,
        optional: true
    }
});
Pos.Collection.Customers.attachSchema(Pos.Schema.Customers);

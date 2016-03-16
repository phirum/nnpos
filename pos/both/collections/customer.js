Pos.Collection.Customers = new Mongo.Collection("pos_customers");
Pos.Schema.Customers = new SimpleSchema({
    name: {
        type: String,
        label: "Name",
        unique: true,
        max: 200
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
    }
});
Pos.Collection.Customers.attachSchema(Pos.Schema.Customers);

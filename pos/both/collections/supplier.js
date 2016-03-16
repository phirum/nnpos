Pos.Collection.Suppliers = new Mongo.Collection("pos_suppliers");
Pos.Schema.Suppliers = new SimpleSchema({
    name: {
        type: String,
        label: "Name",
        unique: true,
        max: 200
    },
    phone: {
        type: String,
        label: "Phone",
        optional:true
    },
    address: {
        type: String,
        label: "Address",
        autoform: {
            afFieldInput: {
                type: "textarea"
            }
        },
        optional:true
    },
    branchId: {
        type: String,
        label: "Branch"
    }
});
Pos.Collection.Suppliers.attachSchema(Pos.Schema.Suppliers);

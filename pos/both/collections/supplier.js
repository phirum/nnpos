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
    },
    /*createdAt: {
        type: Date,
        label: "Created Date",
        autoValue: function () {
            if (this.isInsert)
                return new Date;
        },
        denyUpdate: true,
        optional: true
    },
    updatedAt: {
        type: Date,
        label: "Updated Date",
        autoValue: function () {
            return new Date();
        },
        optional: true
    },
    createdUserId: {
        type: String,
        label: "Created by",
        autoValue: function () {
            if (this.isInsert)
                return Meteor.user()._id;
        },
        denyUpdate: true,
        optional: true
    },
    updatedUserId: {
        type: String,
        label: "Updated by",
        autoValue: function () {
            return Meteor.user()._id;
        },
        optional: true
    }*/
});
Pos.Collection.Suppliers.attachSchema(Pos.Schema.Suppliers);

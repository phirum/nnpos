Pos.Collection.Purchases = new Mongo.Collection("pos_purchases");
/*
Pos.Schema.Sales = new SimpleSchema({
    saleDate: {
        type: Date,
        label: "Sale Date"
    },
    discount: {
        type: Number,
        label: "Discount",
        decimal:true
    },
    subTotal: {
        type: Number,
        label: "SubTotal",
        decimal:true
    },
    total: {
        type: Number,
        label: "Total",
        decimal:true
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
    customerId: {
        type: String,
        label: "Phone"
    },
    //tableId: {
    //    type: String,
    //    label: "Table"
    //},
    createdAt: {
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
    }
});
Pos.Collection.Sales.attachSchema(Pos.Schema.Sales);
*/

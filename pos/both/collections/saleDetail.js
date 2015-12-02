Pos.Collection.SaleDetails = new Mongo.Collection("pos_saleDetails");
/*
Pos.Schema.SaleDetails = new SimpleSchema({
    saleId: {
        type: String,
        label: "Sale"
    },
    productId: {
        type: String,
        label: "Product"
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
    total: {
        type: Number,
        label: "Total",
        decimal: true
    },
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
Pos.Collection.SaleDetails.attachSchema(Pos.Schema.SaleDetails);
*/

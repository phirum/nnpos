Pos.Collection.Promotions = new Mongo.Collection("pos_promotions");
Pos.Schema.Promotions = new SimpleSchema({
    name: {
        type: String,
        label: "Name",
        unique: true,
        max: 200
    },
    startDate: {
        type: Date,
        label: "Start Date"
    },
    endDate: {
        type: Date,
        label: "End Date"
    },
    Percentage: {
        type: Number,
        decimal: true,
        label: "Percentage",
        optional: true
    },
    quantity: {
        type: Number,
        label: "Quantity",
        optional: true
    },
    promotionItem: {
        type: Object,
        label: "PromotionItem",
        optional: true
    },
    'promotionItem.productId': {
        type: String,
        label: "Product Id"
    },
    'promotionItem.quantity': {
        type: Number,
        label: "Item Quantity"
    },
    productId: {
        type: String,
        label: "ProductId"
    },
    description: {
        type: String,
        label: "Description",
        optional: true
    },
    branchId: {
        type: String,
        label: "Branch Id"
    }
    /*createdAt: {
     type: Date,
     label: "Created Date",
     autoValue: function() {
     if (this.isInsert)
     return new Date;
     },
     denyUpdate: true,
     optional: true
     },
     updatedAt: {
     type: Date,
     label: "Updated Date",
     autoValue: function() {
     return new Date();
     },
     optional: true
     },
     createdUserId: {
     type: String,
     label: "Created by",
     autoValue: function() {
     if (this.isInsert)
     return Meteor.user()._id;
     },
     denyUpdate: true,
     optional: true
     },
     updatedUserId: {
     type: String,
     label: "Updated by",
     autoValue: function() {
     return Meteor.user()._id;
     },
     optional: true
     }*/
});
Pos.Collection.Promotions.attachSchema(Pos.Schema.Promotions);

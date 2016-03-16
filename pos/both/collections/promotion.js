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
});
Pos.Collection.Promotions.attachSchema(Pos.Schema.Promotions);

Pos.Collection.PromotionQuantities = new Mongo.Collection("pos_promotionQuantities");
Pos.Schema.PromotionQuantities = new SimpleSchema({
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
    startTime: {
        type: String,
        label: "Start Time"
    },
    endTime: {
        type: String,
        label: "End Time"
    },
    productId: {
        type: String,
        decimal: true,
        label: "Product"
    },
    quantity: {
        type: Number,
        label: "Quantity"
    },
    promotionItems: {
        type: Array,
        label: "PromotionItems",
        min:1
    },
    'promotionItems.$':{
        type:Object
    },
    'promotionItems.$.productId': {
        type: String,
        label: "Product Id"
    },
    'promotionItems.$.quantity': {
        type: Number,
        label: "Item Quantity"
    },
    description: {
        type: String,
        label: "Description",
        optional: true
    },
    branchId: {
        type: String,
        label: "Branch"
    }
});
Pos.Collection.PromotionQuantities.attachSchema(Pos.Schema.PromotionQuantities);

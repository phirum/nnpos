Pos.Collection.PromotionTotalAmounts = new Mongo.Collection("pos_promotionTotalAmounts");
Pos.Schema.PromotionTotalAmounts = new SimpleSchema({
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
    promotionItems: {
        type: Array,
        label: "PromotionItems",
        min:1
    },
    'promotionItems.$':{
        type:Object
    },
    'promotionItems.$.amount': {
        type: Number,
        label: "Amount"
    },
    'promotionItems.$.discount': {
        type: Number,
        label: "Discount(%)",
        decimal:true
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
Pos.Collection.PromotionTotalAmounts.attachSchema(Pos.Schema.PromotionTotalAmounts);

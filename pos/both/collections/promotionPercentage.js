Pos.Collection.PromotionPercentages = new Mongo.Collection("pos_promotionPercentages");
Pos.Schema.PromotionPercentages = new SimpleSchema({
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
    percentage: {
        type: Number,
        label: "Discount(%)",
        decimal: true
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
Pos.Collection.PromotionPercentages.attachSchema(Pos.Schema.PromotionPercentages);

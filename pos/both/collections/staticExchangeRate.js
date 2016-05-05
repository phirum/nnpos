Pos.Collection.StaticExchangeRates = new Mongo.Collection("pos_staticExchangeRates");
Pos.Schema.StaticExchangeRates = new SimpleSchema({
    branchId: {
        type: String,
        label: "Branch"
    },
    USD: {
        type: Number,
        decimal: true,
        label: "USD"
    },
    THB: {
        type: Number,
        decimal: true,
        label: "THB"
    }
});
Pos.Collection.StaticExchangeRates.attachSchema(Pos.Schema.StaticExchangeRates);

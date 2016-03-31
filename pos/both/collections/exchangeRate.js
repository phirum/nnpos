Pos.Collection.ExchangeRates = new Mongo.Collection("pos_exchangeRates");
Pos.Schema.ExchangeRates = new SimpleSchema({
    branchId: {
        type: String,
        label: "Branch"
    },
    base: {
        type: String,
        label: "base CurrencyId",
        max: 50
    },
    rates: {
        type: Array,
        optional: true
    },
    symbol: {
        type: String,
        label: "base symbol"
    },
    'rates.$': {
        type: Object
    },
    'rates.$.toCurrencyId': {
        type: String,
        label: "To Currency"
    },
    'rates.$.rate': {
        type: Number,
        decimal: true,
        label: "Rate"
    },
    'rates.$.symbol': {
        type: String,
        label: "To Symbol"
    },
    _branch:{
        type:Object,
        blackbox:true,
        optional:true
    }
});
Pos.Collection.ExchangeRates.attachSchema(Pos.Schema.ExchangeRates);

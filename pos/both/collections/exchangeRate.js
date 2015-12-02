Pos.Collection.ExchangeRates = new Mongo.Collection("pos_exchangeRates");
/*
Pos.Schema.ExchangeRates = new SimpleSchema({
    base: {
        type: String,
        label: "base CurrencyId",
        max: 50
    },
    rates: {
        type: Array,
        optional: true
    },
    'rates.$': {
        type: Object
    },
    'rates.$.toCurrencyId': {
        type: String
    },
    'rates.$.rate': {
        type:Number,
        decimal:true
    },
    createdAt: {
        type: Date,
        label: "Created Date",
        autoValue: function () {
            if (this.isInsert)
                return new Date;
        }

        ,
        denyUpdate: true,
        optional: true
    }
    ,
    updatedAt: {
        type: Date,
        label: "Updated Date",
        autoValue: function () {
            return new Date();
        }

        ,
        optional: true
    }
    ,
    createdUserId: {
        type: String,
        label: "Created by",
        autoValue: function () {
            if (this.isInsert)
                return Meteor.user()._id;
        }

        ,
        denyUpdate: true,
        optional: true
    }
    ,
    updatedUserId: {
        type: String,
        label: "Updated by",
        autoValue: function () {
            return Meteor.user()._id;
        },
        optional: true
    }
})
;
Pos.Collection.ExchangeRates.attachSchema(Pos.Schema.ExchangeRates);
*/

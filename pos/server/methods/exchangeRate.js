Meteor.methods({
    insertExchangeRate: function (obj) {
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        var today = moment(new Date).format('YYYYMMDD') + "-";
        obj._id = idGenerator.genWithPrefix(Pos.Collection.ExchangeRates, today, 3);
        Pos.Collection.ExchangeRates.insert(obj);
    }
});
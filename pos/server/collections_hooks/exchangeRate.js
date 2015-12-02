Pos.Collection.ExchangeRates.before.insert(function (userId, doc) {
    var prefix=doc.branchId+"-";
    doc._id = idGenerator.genWithPrefix(Pos.Collection.ExchangeRates,prefix,9);
});
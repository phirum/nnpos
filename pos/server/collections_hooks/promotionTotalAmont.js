Pos.Collection.PromotionTotalAmounts.before.insert(function (userId, doc) {
    var prefix = doc.branchId + "-";
    doc._id = idGenerator.genWithPrefix(Pos.Collection.PromotionTotalAmounts, prefix, 7);
});
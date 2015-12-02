Pos.Collection.PromotionPercentages.before.insert(function (userId, doc) {
    var prefix=doc.branchId+"-";
    doc._id = idGenerator.genWithPrefix(Pos.Collection.PromotionPercentages, prefix, 7);
});
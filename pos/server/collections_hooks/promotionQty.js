Pos.Collection.PromotionQuantities.before.insert(function (userId, doc) {
    var prefix=doc.branchId+"-";
    doc._id = idGenerator.genWithPrefix(Pos.Collection.PromotionQuantities, prefix, 7);
});
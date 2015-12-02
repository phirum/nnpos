Pos.Collection.Customers.before.insert(function (userId, doc) {
    var prefix=doc.branchId+"-";
    doc._id = idGenerator.genWithPrefix(Pos.Collection.Customers,prefix,6);
});
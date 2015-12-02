Pos.Collection.Locations.before.insert(function (userId, doc) {
    var prefix=doc.branchId+"-";
    doc._id = idGenerator.genWithPrefix(Pos.Collection.Locations,prefix,3);
});

Pos.Collection.LocationSettings.before.insert(function (userId, doc) {
    var prefix=doc.branchId+"-";
    doc._id = idGenerator.genWithPrefix(Pos.Collection.LocationSettings,prefix,3);
});

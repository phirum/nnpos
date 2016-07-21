Pos.Collection.CustomerLocations.before.insert(function (userId, doc) {
    var prefix = doc.branchId + "-";
    doc._id = idGenerator.genWithPrefix(Pos.Collection.CustomerLocations, prefix, 3);
});

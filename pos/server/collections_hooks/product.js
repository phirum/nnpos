Pos.Collection.Products.before.insert(function (userId, doc) {
    doc._id = idGenerator.gen(Pos.Collection.Products, 7);
});
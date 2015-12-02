Meteor.methods({
    test:function(){
        var arr=['a','b','c','p','test'];
        var arr1=['a','b','c','d','o'];
        return arr.concat(arr1);
    },
    removeFromStock: function (saleId, branchId) {
        var saleDetails = Pos.Collection.SaleDetails.find({saleId: saleId});
        var prefix = branchId + "-";
        saleDetails.forEach(function (sd) {
            var product = Pos.Collection.Products.findOne(sd.productId);
            if (product.productType == "Stock") {
                var stock = Pos.Collection.Stocks.findOne({productId: sd.productId, branchId: branchId});
                if (stock == null) {
                    var obj = {};
                    obj._id = idGenerator.genWithPrefix(Pos.Collection.Stocks, prefix, 6);
                    obj.productId = sd.productId;
                    obj.branchId = branchId;
                    obj.quantity = 0 - sd.quantity;
                    Meteor.call('insertStock', obj);
                } else {
                    var set = {};
                    set.quantity = stock.quantity - sd.quantity;
                    Meteor.call('updateStock', stock._id, set);
                }
            }
        });
    },
    addToStock: function (saleId, branchId) {

    },
    updateCategoriesCount: function () {
        var categories = Pos.Collection.Categories.find();
        categories.forEach(function (c) {
            var count = Pos.Collection.Categories.find({parentId: c._id}).count();
            Pos.Collection.Categories.direct.update(c._id, {$set: {_categoryCount: count}});
        });
    }
});
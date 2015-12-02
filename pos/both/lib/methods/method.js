Meteor.methods({
    insertByCollection: function (collection,obj) {
        collection=eval(collection);
        collection.insert(obj);
    },
    directInsertByCollection: function (collection,obj) {
        collection=eval(collection);
        collection.direct.insert(obj);
    },
    updateByCollection: function (collection,id, set,unset) {
        collection=eval(collection);
        var updateObject = {};
        if (set != null) updateObject.$set = set;
        if (unset != null) updateObject.$unset = unset;
        collection.update(id, updateObject);
    },
    directUpdateByCollection:function(collection,id, set,unset) {
        collection=eval(collection);
        var updateObject = {};
        if (set != null) updateObject.$set = set;
        if (unset != null) updateObject.$unset = unset;
        collection.direct.update(id, updateObject);
    },
    getProductSaleReport: function () {
        var sD = Pos.Collection.SaleDetails.aggregate([{
            $group: {
                _id: {productId: "$productId"}
                , qty: {$sum: "$quantity"}
            }
        }]);
        var arr = [];
        sD.forEach(function (s) {
            var product = Pos.Collection.findOne(s._id.productId);
            arr.push({productName: product.name, quantity: s.qty});
        });

        return arr;
    },
    getCategory: function () {
        return Pos.Collection.Categories.find();
    }
});
roundDownRielCurrency = function (value) {
    return value - (value % 100);
};
roundRielCurrency = function (value) {
    value = parseInt(value);
    var returnValue = 0;
    if (value > 0) {
        returnValue = value % 100 >= 50 ? value + (100 - (value % 100)) : value - (value % 100);
    } else if (value < 0) {
        var absRK = Math.abs(value);
        returnValue = absRK % 100 > 50 ? value - (100 - (absRK % 100)) : value + (absRK % 100);
    }
    return returnValue;
};


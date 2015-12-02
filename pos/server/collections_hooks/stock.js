/*
Pos.Collection.Stocks.after.insert(function (userId, doc) {
    var adjustmentIds = Pos.Collection.Adjustments.find({status: "Unsaved"}, {fields: {_id: 1}}).map(function (a) {
        return a._id;
    });
    if (adjustmentIds.length > 0) {
        Pos.Collection.AdjustmentDetails.update({
                productId: doc.productId,
                branchId: doc.branchId,
                adjustmentId: {$in: adjustmentIds}
            }, {
                oldQuantity:doc.quantity,
                NewQuantity:doc.quantity,
                diffQuantity:0,
                diffCost:0
            },{multi: true}
        )
    }

});
Pos.Collection.Stocks.after.update(function (userId, doc, fieldNames, modifier, options) {
    var adjustmentIds = Pos.Collection.Adjustments.find({status: "Unsaved"}, {fields: {_id: 1}}).map(function (a) {
        return a._id;
    });
    if (adjustmentIds.length > 0) {
        Pos.Collection.AdjustmentDetails.update({
                productId: modifier.$set.productId,
                branchId: modifier.$set.branchId,
                adjustmentId: {$in: adjustmentIds}
            }, {
                oldQuantity:modifier.$set.quantity,
                NewQuantity:modifier.$set.quantity,
                diffQuantity:0,
                diffCost:0
            },{multi: true}
        )
    }
});
*/

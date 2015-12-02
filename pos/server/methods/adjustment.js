Meteor.methods({
    //Adjustment
    insertAdjustmentAndAdjustmentDetail: function (adjustment, adjustmentDetail) {
        var adjustmentId = Pos.Collection.Adjustments.insert(adjustment);
        adjustmentDetail._id = idGenerator.genWithPrefix(
            Pos.Collection.AdjustmentDetails, adjustmentId, 3);
        adjustmentDetail.adjustmentId = adjustmentId;
        Pos.Collection.AdjustmentDetails.insert(adjustmentDetail);
    },
    directInsertAdjustment: function (obj) {
        Pos.Collection.AdjustmentDetails.direct.insert(obj);
    },
    insertAdjustment: function (obj) {
        Pos.Collection.Adjustments.insert(obj);
    },
    directUpdateAdjustment: function (id, set, unset) {
        var updateObject = {};
        if (set != null) updateObject.$set = set;
        if (unset != null) updateObject.$unset = unset;
        Pos.Collection.Adjustments.direct.update(id, updateObject)
    },
    updateAdjustment: function (id, set, unset) {
        var updateObject = {};
        if (set != null) updateObject.$set = set;
        if (unset != null) updateObject.$unset = unset;
        Pos.Collection.Adjustments.update(id, updateObject);
    },
    directInsertAdjustmentDetails: function (obj) {
        Pos.Collection.AdjustmentDetails.direct.insert(obj);
    },
    insertAdjustmentDetails: function (obj) {
        Pos.Collection.AdjustmentDetails.insert(obj);
    },
    directUpdateAdjustmentDetails: function (id, set, unset) {
        var updateObject = {};
        if (set != null) updateObject.$set = set;
        if (unset != null) updateObject.$unset = unset;
        Pos.Collection.AdjustmentDetails.direct.update(id, updateObject)
    },
    updateAdjustmentDetails: function (id, set, unset) {
        var updateObject = {};
        if (set != null) updateObject.$set = set;
        if (unset != null) updateObject.$unset = unset;
        Pos.Collection.AdjustmentDetails.update(id, updateObject);
    },
    cancelAdjustment: function (adjustmentId) {
        //Pos.Collection.AdjustmentDetails.remove({adjustmentId: adjustmentId});
        Pos.Collection.Adjustments.remove(adjustmentId);
    }
});
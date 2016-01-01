Meteor.methods({
    //Adjustment
    insertAdjustmentAndAdjustmentDetail: function (adjustment, adjustmentDetail) {
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        var adjustmentId = Pos.Collection.Adjustments.insert(adjustment);
        adjustmentDetail._id = idGenerator.genWithPrefix(
            Pos.Collection.AdjustmentDetails, adjustmentId, 3);
        adjustmentDetail.adjustmentId = adjustmentId;
        Pos.Collection.AdjustmentDetails.insert(adjustmentDetail);
    },
    directInsertAdjustment: function (obj) {
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        Pos.Collection.AdjustmentDetails.direct.insert(obj);
    },
    insertAdjustment: function (obj) {
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        Pos.Collection.Adjustments.insert(obj);
    },
    directUpdateAdjustment: function (id, set, unset) {
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        var updateObject = {};
        if (set != null) updateObject.$set = set;
        if (unset != null) updateObject.$unset = unset;
        Pos.Collection.Adjustments.direct.update(id, updateObject)
    },
    updateAdjustment: function (id, set, unset) {
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        var updateObject = {};
        if (set != null) updateObject.$set = set;
        if (unset != null) updateObject.$unset = unset;
        Pos.Collection.Adjustments.update(id, updateObject);
    },
    directInsertAdjustmentDetails: function (obj) {
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        Pos.Collection.AdjustmentDetails.direct.insert(obj);
    },
    insertAdjustmentDetails: function (obj) {
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        Pos.Collection.AdjustmentDetails.insert(obj);
    },
    directUpdateAdjustmentDetails: function (id, set, unset) {
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        var updateObject = {};
        if (set != null) updateObject.$set = set;
        if (unset != null) updateObject.$unset = unset;
        Pos.Collection.AdjustmentDetails.direct.update(id, updateObject)
    },
    updateAdjustmentDetails: function (id, set, unset) {
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        var updateObject = {};
        if (set != null) updateObject.$set = set;
        if (unset != null) updateObject.$unset = unset;
        Pos.Collection.AdjustmentDetails.update(id, updateObject);
    },
    cancelAdjustment: function (adjustmentId) {
        //Pos.Collection.AdjustmentDetails.remove({adjustmentId: adjustmentId});
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        Pos.Collection.Adjustments.remove(adjustmentId);
    }
});
Meteor.methods({
    insertPayment: function (obj) {
        Pos.Collection.Payments.insert(obj);
    },
    directInsertPayment: function (obj) {
        Pos.Collection.Payments.direct.insert(obj);
    },
    updatePayment: function (id, set) {
        Pos.Collection.Payments.update(id, {$set: set});
    },
    directUpdatePayment: function (id, set, unset) {
        var updateObject = {};
        if (set != null) updateObject.$set = set;
        if (unset != null) updateObject.$unset = unset;
        Pos.Collection.Payments.direct.update(id, updateObject)
    }
});
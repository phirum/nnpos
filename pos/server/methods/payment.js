Meteor.methods({
    insertPayment: function (obj) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        var prefix = obj.saleId;
        obj.paymentDate = obj.paymentDate ? obj.paymentDate : new Date();
        obj._id = idGenerator.genWithPrefix(Pos.Collection.Payments, prefix, 3);
        return Pos.Collection.Payments.insert(obj);
    },
    directInsertPayment: function (obj) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        Pos.Collection.Payments.direct.insert(obj);
    },
    updatePayment: function (id, set) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        Pos.Collection.Payments.update(id, {$set: set});
    },
    directUpdatePayment: function (id, set, unset) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        var updateObject = {};
        if (set != null) updateObject.$set = set;
        if (unset != null) updateObject.$unset = unset;
        Pos.Collection.Payments.direct.update(id, updateObject)
    }
});
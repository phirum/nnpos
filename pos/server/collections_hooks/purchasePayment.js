/*Pos.Collection.PurchasePayments.before.insert(function (userId, doc) {
    var prefix = doc.purchaseId;
    doc.paymentDate = doc.paymentDate ? doc.paymentDate : new Date();
    doc._id = idGenerator.genWithPrefix(Pos.Collection.PurchasePayments, prefix, 3);
});*/

Pos.Collection.PurchasePayments.after.remove(function (userId, doc) {
    Meteor.defer(function () {
        Meteor._sleepForMs(1000);
        var purchaseObj = {};
        purchaseObj.owedAmount = doc.dueAmount;
        purchaseObj.status = "Owed";
        Pos.Collection.Purchases.direct.update(doc.purchaseId, {$set: purchaseObj});
    });
});
Pos.Collection.PurchasePayments.after.insert(function (userId, doc) {
    Meteor.defer(function () {
        Meteor._sleepForMs(1000);
        var purchaseObj = {};
        if (doc.balanceAmount <= 0) {
            purchaseObj.status = "Paid";
            purchaseObj.owedAmount = 0;
        } else {
            purchaseObj.status = "Owed";
            purchaseObj.owedAmount = doc.balanceAmount
        }
        Pos.Collection.Purchases.direct.update(doc.purchaseId, {$set: purchaseObj});
    });
});
Pos.Collection.PurchasePayments.after.update(function (userId, doc, fieldNames, modifier, options) {
    Meteor.defer(function () {
        Meteor._sleepForMs(1000);
        var purchaseObj = {};
        if (doc.balanceAmount <= 0) {
            purchaseObj.status = "Paid";
            purchaseObj.owedAmount = 0;
        } else {
            purchaseObj.status = "Owed";
            purchaseObj.owedAmount = doc.balanceAmount
        }
        Pos.Collection.Purchases.direct.update(doc.purchaseId, {$set: purchaseObj});

    });
});

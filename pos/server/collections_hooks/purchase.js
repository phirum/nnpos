Pos.Collection.PurchaseDetails.before.insert(function (user, doc) {
    doc._id = idGenerator.genWithPrefix(Pos.Collection.PurchaseDetails, doc.purchaseId, 3);
});
Pos.Collection.PurchaseDetails.after.remove(function (userId, doc) {
    var purchase = Pos.Collection.Purchases.findOne(doc.purchaseId);
    if (purchase != null) {
        updatePurchaseTotal(doc.purchaseId);
    }
});
Pos.Collection.Purchases.before.update(function (userId, doc, fieldNames, modifier, options) {

        if (modifier.$set.locationId != null && modifier.$set.locationId != doc.locationId) {
            Pos.Collection.PurchaseDetails.update(
                {purchaseId: doc._id},
                {$set: {locationId: modifier.$set.locationId}},
                {multi: true});
        }

});
/*Pos.Collection.Purchases.after.update(function (userId, doc, fieldNames, modifier, options) {
    updatePurchaseTotal(doc._id);
});*/

Pos.Collection.PurchaseDetails.after.insert(function (userId, doc) {
    updatePurchaseTotal(doc.purchaseId);

});

Pos.Collection.PurchaseDetails.after.update(function (userId, doc, fieldNames, modifier, options) {
    updatePurchaseTotal(doc.purchaseId);
});

Pos.Collection.Purchases.after.remove(function (userId, doc) {
    Pos.Collection.PurchaseDetails.remove({purchaseId: doc._id});
    //Pos.Collection.PurchaseDetails.direct.remove({purchaseId: doc._id});
});

function updatePurchaseTotal(purchaseId) {
    Meteor.defer(function () {
        Meteor._sleepForMs(1000);
        //var discount = Pos.Collection.Purchases.findOne(purchaseId).discountAmount;
        var purchase = Pos.Collection.Purchases.findOne(purchaseId);
        var discount = purchase && purchase.discount ? purchase.discount : 0;
        var purchaseSubTotal = 0;
        var purchaseDetails = Pos.Collection.PurchaseDetails.find({purchaseId: purchaseId});
        purchaseDetails.forEach(function (purchaseDetail) {
            purchaseSubTotal += parseFloat(purchaseDetail.amount);
        });
        var baseCurrencyId = Cpanel.Collection.Setting.findOne().baseCurrency;
        /*var Setting = Cpanel.Collection.Setting.findOne();
         var baseCurrencyId = Setting && Setting.baseCurrency ? Setting.baseCurrency : 0;*/
        //var total = purchaseSubTotal - discount;
        var total = purchaseSubTotal * (1 - discount / 100);
        if (baseCurrencyId == "KHR") {
            total = roundRielCurrency(total);
        }
        var set = {};
        set.subTotal = purchaseSubTotal;
        set.total = total;
        set.owedAmount = total;
        //set.discountAmount=purchaseSubTotal-total;
        Pos.Collection.Purchases.direct.update(purchaseId, {$set: set});
        //Meteor.call('updatePurchase', purchaseId, set);
    });

}

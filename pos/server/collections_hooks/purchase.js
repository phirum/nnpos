//--------------------------Purchase-----------------------------
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

Pos.Collection.Purchases.after.remove(function (userId, doc) {
    Meteor.defer(function () {
        reduceFromInventoryFun(doc._id, doc.branchId);
        Pos.Collection.PurchaseDetails.remove({purchaseId: doc._id});
    });
    //Pos.Collection.PurchaseDetails.direct.remove({purchaseId: doc._id});
});


//------------------------Purchase Detail---------------------------
Pos.Collection.PurchaseDetails.before.insert(function (user, doc) {
    doc._id = idGenerator.genWithPrefix(Pos.Collection.PurchaseDetails, doc.purchaseId, 3);
});

Pos.Collection.PurchaseDetails.after.insert(function (userId, doc) {
    updatePurchaseTotal(doc.purchaseId);
});

Pos.Collection.PurchaseDetails.after.update(function (userId, doc, fieldNames, modifier, options) {
    updatePurchaseTotal(doc.purchaseId);
});

Pos.Collection.PurchaseDetails.after.remove(function (userId, doc) {
    var purchase = Pos.Collection.Purchases.findOne(doc.purchaseId);
    if (purchase != null) {
        updatePurchaseTotal(doc.purchaseId);
    }
});


function updatePurchaseTotal(purchaseId) {
    Meteor.defer(function () {
        Meteor._sleepForMs(200);
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
        purchaseSubTotal = math.round(purchaseSubTotal, 2);
        var total = purchaseSubTotal * (1 - discount / 100);
        if (baseCurrencyId == "KHR") {
            total = roundRielCurrency(total);
        } else {
            total = math.round(total, 2);
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
function reduceFromInventoryFun(purchaseId, branchId) {

    /*try {*/
    var purchaseDetails = Pos.Collection.PurchaseDetails.find({purchaseId: purchaseId});
    purchaseDetails.forEach(function (pd) {
        var inventories = Pos.Collection.FIFOInventory.find({
            branchId: branchId,
            productId: pd.productId,
            locationId: pd.locationId,
            isSale: false
        }, {sort: {_id: -1}}).fetch();
        var enoughQuantity = pd.quantity;
        for (var i = 0; i < inventories.length; i++) {
            var inventorySet = {};
            if (inventories[i].price == pd.price && enoughQuantity != 0) {
                var remainQuantity = inventories[i].quantity - enoughQuantity;
                if (remainQuantity > 0) {
                    inventorySet.quantity = remainQuantity;
                    inventorySet.remainQty = inventories[i].remainQty - enoughQuantity;
                    inventorySet.imei = subtractImeiArray(inventories[i].imei, pd.imei);
                    enoughQuantity = 0;
                    Pos.Collection.FIFOInventory.update(inventories[i]._id, {$set: inventorySet});
                } else {
                    enoughQuantity -= inventories[i].quantity;
                    Pos.Collection.FIFOInventory.direct.remove(inventories[i]._id);
                }
            } else {
                inventorySet.remainQty = inventories[i].remainQty - enoughQuantity;
                inventorySet.imei = subtractImeiArray(inventories[i].imei, pd.imei);
                Pos.Collection.FIFOInventory.update(inventories[i]._id, {$set: inventorySet});
            }
        }
    });
    /*     return true;
     } catch (e) {
     throw new Meteor.Error(e.message);
     }*/

}
function subtractImeiArray(src, filt) {
    var temp = {}, i, result = [];
    // load contents of filt into an object
    // for faster lookup
    for (i = 0; i < filt.length; i++) {
        temp[filt[i]] = true;
    }

    // go through each item in src
    for (i = 0; i < src.length; i++) {
        if (!(src[i] in temp)) {
            result.push(src[i]);
        }
    }
    return (result);
}
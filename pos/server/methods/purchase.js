Meteor.methods({
    //Purchase
    insertPurchaseAndPurchaseDetail: function (purchase, purchaseDetail) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        var todayDate = moment().format('YYYYMMDD');
        var prefix = purchase.branchId + "-" + todayDate;
        var purchaseId = idGenerator.genWithPrefix(Pos.Collection.Purchases, prefix, 4);
        purchase._id = purchaseId;
        Pos.Collection.Purchases.insert(purchase);
        purchaseDetail._id = idGenerator.genWithPrefix(Pos.Collection.PurchaseDetails, purchaseId, 3);
        purchaseDetail.purchaseId = purchaseId;
        Pos.Collection.PurchaseDetails.insert(purchaseDetail);
        return purchaseId;
    },
    insertPurchase: function (obj) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        return Pos.Collection.Purchases.insert(obj);
    },
    directInsertPurchase: function (obj) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        Pos.Collection.Purchases.direct.insert(obj);
    },
    updatePurchase: function (id, set, unset) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        var updateObject = {};
        if (set != null) updateObject.$set = set;
        if (unset != null) updateObject.$unset = unset;
        Pos.Collection.Purchases.update(id, updateObject);
    },
    directUpdatePurchase: function (id, set, unset) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        var updateObject = {};
        if (set != null) updateObject.$set = set;
        if (unset != null) updateObject.$unset = unset;
        Pos.Collection.Purchases.direct.update(id, updateObject);
    },
    insertPurchaseDetails: function (obj) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        Pos.Collection.PurchaseDetails.insert(obj);
    },
    directInsertPurchaseDetails: function (obj) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        Pos.Collection.PurchaseDetails.direct.insert(obj);
    },
    updatePurchaseDetails: function (id, set) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        Pos.Collection.PurchaseDetails.update(id, {$set: set}, {validate: false});
    },
    directUpdatePurchaseDetails: function (id, set, unset) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        var updateObject = {};
        if (set != null) updateObject.$set = set;
        if (unset != null) updateObject.$unset = unset;
        Pos.Collection.PurchaseDetails.direct.update(id, updateObject);
    },
    cancelPurchase: function (purchaseId) {
        //  Pos.Collection.PurchaseDetails.remove({purchaseId: purchaseId});
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        Pos.Collection.Purchases.remove(purchaseId);
    },
    isExistIMEI: function (imei, branchId, locationId) {
        //var saleDetail = Pos.Collection.SaleDetails.findOne({imei: {"$in": [imei]}});
        var inventory = Pos.Collection.FIFOInventory.findOne({
            branchId: branchId,
            locationId: locationId,
            imei: {"$in": [imei]}
        });
        if (inventory == null) {
            return false;
        } else {
            var lastInventory = Pos.Collection.FIFOInventory.findOne({
                productId:inventory.productId,
                branchId: branchId,
                locationId: locationId
            }, {sort: {_id: -1}});
            return inventory._id == lastInventory._id;
        }

        //return (saleDetail || inventory);
    },
    //need to refactor code later
    updatePurchaseTotalByDiscount: function (purchaseId, discount) {
        var purchaseSubTotal = 0;
        var purchaseDetails = Pos.Collection.PurchaseDetails.find({purchaseId: purchaseId});
        purchaseDetails.forEach(function (purchaseDetail) {
            purchaseSubTotal += parseFloat(purchaseDetail.amount);
        });
        var baseCurrencyId = Cpanel.Collection.Setting.findOne().baseCurrency;
        var total = purchaseSubTotal * (1 - discount / 100);
        if (baseCurrencyId == "KHR") {
            total = roundRielCurrency(total);
        }
        var set = {};
        set.subTotal = purchaseSubTotal;
        set.total = total;
        Pos.Collection.Purchases.direct.update(purchaseId, {$set: set});
    }

});


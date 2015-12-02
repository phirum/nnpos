/*
Meteor.methods({
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
    },
    //Sale
    insertSaleAndSaleDetail: function (sale, saleDetail) {
        sale.createdAt = new Date();
        sale.updatedAt = new Date();
        sale.createdUserId = Meteor.user()._id;
        sale.updatedUserId = Meteor.user()._id;
        var saleId = Pos.Collection.Sales.insert(sale);

        saleDetail._id = idGenerator.genWithPrefix(Pos.Collection.SaleDetails, saleId, 3);
        saleDetail.createdAt = new Date();
        saleDetail.updatedAt = new Date();
        saleDetail.createdUserId = Meteor.user()._id;
        saleDetail.updatedUserId = Meteor.user()._id;
        saleDetail.saleId = saleId;
        Pos.Collection.SaleDetails.insert(saleDetail);
    },
    insertSale: function (obj) {
        obj.createdAt = new Date();
        obj.updatedAt = new Date();
        obj.createdUserId = Meteor.user()._id;
        obj.updatedUserId = Meteor.user()._id;
        return Pos.Collection.Sales.insert(obj);
    },
    updateSale: function (id, set) {
        set.updatedAt = new Date();
        set.updatedUserId = Meteor.user()._id;
        Pos.Collection.Sales.update(id, {$set: set});
    },
    insertSaleDetails: function (obj) {
        obj.createdAt = new Date();
        obj.updatedAt = new Date();
        obj.createdUserId = Meteor.user()._id;
        obj.updatedUserId = Meteor.user()._id;
        Pos.Collection.SaleDetails.insert(obj);
    },
    updateSaleDetails: function (id, set) {
        set.updatedAt = new Date();
        set.updatedUserId = Meteor.user()._id;
        Pos.Collection.SaleDetails.update(id, {$set: set});
    },
    cancelSale: function (saleId) {
        Pos.Collection.SaleDetails.remove({saleId: saleId});
        Pos.Collection.Sales.remove(saleId);
    },
    //Purchase
    insertPurchaseAndPurchaseDetail: function (purchase, purchaseDetail) {
        purchase.createdAt = new Date();
        purchase.updatedAt = new Date();
        purchase.createdUserId = Meteor.user()._id;
        purchase.updatedUserId = Meteor.user()._id;
        var purchaseId = Pos.Collection.Purchases.insert(purchase);

        purchaseDetail._id = idGenerator.genWithPrefix(Pos.Collection.PurchaseDetails, purchaseId, 3);
        purchaseDetail.createdAt = new Date();
        purchaseDetail.updatedAt = new Date();
        purchaseDetail.createdUserId = Meteor.user()._id;
        purchaseDetail.updatedUserId = Meteor.user()._id;
        purchaseDetail.purchaseId = purchaseId;
        Pos.Collection.PurchaseDetails.insert(purchaseDetail);
    },
    insertPurchase: function (obj) {
        obj.createdAt = new Date();
        obj.updatedAt = new Date();
        obj.createdUserId = Meteor.user()._id;
        obj.updatedUserId = Meteor.user()._id;
        return Pos.Collection.Purchases.insert(obj);
    },

    updatePurchase: function (id, set) {
        set.updatedAt = new Date();
        set.updatedUserId = Meteor.user()._id;
        Pos.Collection.Purchases.update(id, {$set: set});
    },

    insertPurchaseDetails: function (obj) {
        obj.createdAt = new Date();
        obj.updatedAt = new Date();
        obj.createdUserId = Meteor.user()._id;
        obj.updatedUserId = Meteor.user()._id;
        Pos.Collection.PurchaseDetails.insert(obj);
    },
    updatePurchaseDetails: function (id, set) {
        set.updatedAt = new Date();
        set.updatedUserId = Meteor.user()._id;
        Pos.Collection.PurchaseDetails.update(id, {$set: set});
    },
    cancelPurchase: function (purchaseId) {
        Pos.Collection.PurchaseDetails.remove({purchaseId: purchaseId});
        Pos.Collection.Purchases.remove(purchaseId);
    },

    //Adjustment
    insertAdjustmentAndAdjustmentDetail: function (adjustment, adjustmentDetail) {
        adjustment.createdAt = new Date();
        adjustment.updatedAt = new Date();
        adjustment.createdUserId = Meteor.user()._id;
        adjustment.updatedUserId = Meteor.user()._id;
        var adjustmentId = Pos.Collection.Adjustments.insert(adjustment);

        adjustmentDetail._id = idGenerator.genWithPrefix(Pos.Collection.AdjustmentDetails, adjustmentId, 3);
        adjustmentDetail.createdAt = new Date();
        adjustmentDetail.updatedAt = new Date();
        adjustmentDetail.createdUserId = Meteor.user()._id;
        adjustmentDetail.updatedUserId = Meteor.user()._id;
        adjustmentDetail.adjustmentId = adjustmentId;
        Pos.Collection.AdjustmentDetails.insert(adjustmentDetail);
    },
    insertAdjustment: function (obj) {
        obj.createdAt = new Date();
        obj.updatedAt = new Date();
        obj.createdUserId = Meteor.user()._id;
        obj.updatedUserId = Meteor.user()._id;
        return Pos.Collection.Adjustments.insert(obj);
    },
    updateAdjustment: function (id, set) {
        set.updatedAt = new Date();
        set.updatedUserId = Meteor.user()._id;
        Pos.Collection.Adjustments.update(id, {$set: set});
    },
    insertAdjustmentDetails: function (obj) {
        obj.createdAt = new Date();
        obj.updatedAt = new Date();
        obj.createdUserId = Meteor.user()._id;
        obj.updatedUserId = Meteor.user()._id;
        Pos.Collection.AdjustmentDetails.insert(obj);
    },
    updateAdjustmentDetails: function (id, set) {
        set.updatedAt = new Date();
        set.updatedUserId = Meteor.user()._id;
        Pos.Collection.AdjustmentDetails.update(id, {$set: set});
    },
    cancelAdjustment: function (adjustmentId) {
        Pos.Collection.AdjustmentDetails.remove({adjustmentId: adjustmentId});
        Pos.Collection.Adjustments.remove(adjustmentId);
    },

    insertExchangeRate: function (obj) {
        var today = moment(new Date).format('YYYYMMDD') + "-";
        obj._id = idGenerator.genWithPrefix(Pos.Collection.ExchangeRates, today, 3);
        obj.createdAt = new Date();
        obj.updatedAt = new Date();
        Pos.Collection.ExchangeRates.insert(obj);
    },
    insertPayment: function (obj) {
        obj.createdAt = new Date();
        obj.updatedAt = new Date();
        obj.createdUserId = Meteor.user()._id;
        obj.updatedUserId = Meteor.user()._id;
        Pos.Collection.Payments.insert(obj);
    },
    updatePayment: function (id, set) {
        set.updatedAt = new Date();
        set.updatedUserId = Meteor.user()._id;
        Pos.Collection.Payments.update(id, {$set: set});
    },

    insertStock: function (obj) {
        obj.createdAt = new Date();
        obj.updatedAt = new Date();
        obj.createdUserId = Meteor.user()._id;
        obj.updatedUserId = Meteor.user()._id;
        Pos.Collection.Stocks.insert(obj);
    },
    updateStock: function (id, set) {
        set.updatedAt = new Date();
        set.updatedUserId = Meteor.user()._id;
        Pos.Collection.Stocks.update(id, {$set: set});
    },
    updateProduct: function (id, set) {
        set.updatedAt = new Date();
        set.updatedUserId = Meteor.user()._id;
        Pos.Collection.Products.update(id, {$set: set});
    },
    insertStockHistory: function (branchId) {
        var products = Pos.Collection.Products.find({productType: "Stock"});
        //var branches = Cpanel.Collection.Branch.find();
        var today = moment(new Date).format('YYYYMMDD');
        var prefix = branchId + "-" + today + "-";
        var obj = {};
        obj._id = idGenerator.genWithPrefix(Pos.Collection.StockHistories, prefix, 3);
        obj.stockList = [];
        // branches.forEach(function (b) {
        products.forEach(function (p) {
            var stock = Pos.Collection.Stocks.findOne({productId: p._id, branchId: branchId});
            var quantity = stock != null ? stock.quantity : 0;
            obj.stockList.push({
                productId: p._id,
                barcode: p.barcode,
                productName: p.name,
                retailPrice: p.retailPrice,
                wholesalePrice: p.wholesalePrice,
                purchasePrice: p.purchasePrice,
                quantity: quantity
            });
        });
        obj.branchId = branchId;
        obj.createdAt = new Date();
        obj.updatedAt = new Date();
        obj.createdUserId = Meteor.user()._id;
        obj.updatedUserId = Meteor.user()._id;
        return Pos.Collection.StockHistories.insert(obj);
        // });
        //return remove none necessary object in array of object
        //var st=$.grep(stockList, function(s){ return s.quantity <=3 ; });
        //return stockList;
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

*/

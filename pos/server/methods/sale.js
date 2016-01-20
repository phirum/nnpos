Meteor.methods({
    //Sale
    insertSaleAndSaleDetail: function (sale, saleDetail) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        var todayDate = moment().format('YYYYMMDD');
        var prefix = sale.branchId + "-" + todayDate;
        var saleId = idGenerator.genWithPrefix(Pos.Collection.Sales, prefix, 4);
        sale._id = saleId;
        Pos.Collection.Sales.insert(sale);
        saleDetail.saleId = saleId;
        Pos.Collection.SaleDetails.insert(saleDetail);
        return saleId;
    },
    insertSale: function (obj) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        return Pos.Collection.Sales.insert(obj);
    },
    directInsertSale: function (obj) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        return Pos.Collection.Sales.direct.insert(obj);
    },
    directUpdateSale: function (id, set) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        Pos.Collection.Sales.direct.update(id, {$set: set});
    },
    updateSale: function (id, set) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        Pos.Collection.Sales.update(id, {$set: set});
    },
    directInsertSaleDetails: function (obj) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        Pos.Collection.SaleDetails.direct.insert(obj);
    },
    insertSaleDetails: function (obj) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        Pos.Collection.SaleDetails.insert(obj);
    },
    directUpdateSaleDetails: function (id, set) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        Pos.Collection.SaleDetails.direct.update(id, {$set: set});
    },
    updateSaleDetails: function (id, set) {
        Pos.Collection.SaleDetails.update(id, {$set: set});
    },
    cancelSale: function (saleId) {
        //Pos.Collection.SaleDetails.remove({saleId: saleId});
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        Pos.Collection.Sales.remove(saleId);
    },
    updateToRetailSale: function (saleId) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        Pos.Collection.SaleDetails.find({saleId: saleId}).forEach(function (sd) {
            var retailPrice = Pos.Collection.Products.findOne(sd.productId).retailPrice;
            var detailObj = {};
            detailObj.price = retailPrice;
            detailObj.amount = (detailObj.price * sd.quantity) * (1 - sd.discount / 100);
            Pos.Collection.Sales.direct.update(sd._id, {$set: detailObj});
        });
        var set = {};
        set.isRetail = true;
        Pos.Collection.Sales.update(saleId, {$set: set});
    },
    updateToRetailOrWholesale: function (saleId, isRetail) {
        if (isRetail) {
            Pos.Collection.SaleDetails.find({saleId: saleId}).forEach(function (sd) {
                if (!sd.isPromotion) {
                    var retailPrice = Pos.Collection.Products.findOne(sd.productId).retailPrice;
                    var set = {};
                    set.price = retailPrice;
                    set.amount = (set.price * sd.quantity) * (1 - sd.discount / 100);
                    Pos.Collection.SaleDetails.direct.update(sd._id, {$set: set});
                }
            });
        } else {
            Pos.Collection.SaleDetails.find({saleId: saleId}).forEach(function (sd) {
                if (!sd.isPromotion) {
                    var wholesalePrice = Pos.Collection.Products.findOne(sd.productId).wholesalePrice;
                    var set = {};
                    set.price = wholesalePrice;
                    set.amount = (set.price * sd.quantity) * (1 - sd.discount / 100);
                    Pos.Collection.SaleDetails.direct.update(sd._id, {$set: set});
                }
            });
        }
        var set = {};
        set.isRetail = isRetail;
        Pos.Collection.Sales.update(saleId, {$set: set});
    },

    //need to refactor code later
    updateSaleTotalByDiscount: function (saleId, discount) {
        var set = {};
        //var discount = Pos.Collection.Sales.findOne(saleId).discountAmount;
        //var sale = Pos.Collection.Sales.findOne(saleId);
        var saleSubTotal = 0;
        var saleDetails = Pos.Collection.SaleDetails.find({saleId: saleId});
        saleDetails.forEach(function (saleDetail) {
            saleSubTotal += parseFloat(saleDetail.amount);
        });
        /*  var saleDate = sale.saleDate;
         var saleTime = moment(saleDate).format("HH:mm");
         var selector = {};
         selector.startDate = {$lte: saleDate};
         selector.endDate = {$gte: saleDate};
         selector.startTime = {$lte: saleTime};
         selector.endTime = {$gte: saleTime};
         var promotionTotalAmounts = Pos.Collection.PromotionTotalAmounts.findOne(selector);
         var promotionPercentage = Pos.Collection.PromotionPercentages.findOne(selector);
         if (promotionTotalAmounts != null) {
         var arr = sortArrayByKey(promotionTotalAmounts.promotionItems, "amount");
         arr.forEach(function (item) {
         if (saleSubTotal >= item.amount) {
         discount = item.discount;
         }
         });
         set.discount = discount;
         } else if (promotionPercentage != null) {
         set.discount = discount = promotionPercentage.percentage;
         } else {
         set.discount = discount = 0;
         }*/
        set.discount = discount;
        var baseCurrencyId = Cpanel.Collection.Setting.findOne().baseCurrency;
        //var total = saleSubTotal - discount;
        var total = saleSubTotal * (1 - discount / 100);
        if (baseCurrencyId == "KHR") {
            total = roundRielCurrency(total);
        }
        var discountAmount = saleSubTotal * discount / 100;

        set.subTotal = saleSubTotal;
        set.total = total;
        set.discountAmount = discountAmount;
        //set.discountAmount=saleSubTotal-total;
        Pos.Collection.Sales.direct.update(saleId, {$set: set});
        //Meteor.call('updateSale', saleId, set);

    }
});

function sortArrayByKey(array, key) {
    return array.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}
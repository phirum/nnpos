Meteor.publish('posCategory', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.Categories.find(selector, {removed: true});
    }
});

Meteor.publish('posCustomer', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.Customers.find(selector, {removed: true});
    }
});

Meteor.publish('posSubCategory', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.SubCategories.find(selector, {removed: true});
    }
});
Meteor.publish('posUnit', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.Units.find(selector, {removed: true});
    }
});
Meteor.publish('posStaff', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.Staffs.find(selector, {removed: true});
    }
});

Meteor.publish('posSupplier', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.Suppliers.find(selector, {removed: true});
    }
});
Meteor.publish('posProduct', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.Products.find(selector, {removed: true});
    }
});

Meteor.publish('posSale', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.Sales.find(selector, {removed: true});
    }
});
Meteor.publish('posSaleDetail', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.SaleDetails.find(selector, {removed: true});
    }
});
Meteor.publish('posPayment', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.Payments.find(selector, {removed: true});
    }
});
Meteor.publish('posPurchase', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.Purchases.find(selector, {removed: true});
    }
});
Meteor.publish('posPurchaseDetail', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.PurchaseDetails.find(selector, {removed: true});
    }
});
Meteor.publish('posStock', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.Stocks.find(selector, {removed: true});
    }
});
Meteor.publish('posExchangeRate', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.ExchangeRates.find(selector, {removed: true});
    }
});
Meteor.publish('posStockHistory', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.StockHistories.find(selector, {removed: true});
    }
});

Meteor.publish('posUserStaff', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.UserStaffs.find(selector, {removed: true});
    }
});

Meteor.publish('images', function (selector) {
    if (this.userId) {
        return Images.find()
    }
});

Meteor.publish('posAdjustmentDetail', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.AdjustmentDetails.find(selector, {removed: true});
    }
});
Meteor.publish('posAdjustment', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.Adjustments.find(selector, {removed: true});
    }
});
Meteor.publish('posPromotion', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.Promotions.find(selector, {removed: true});
    }
});
Meteor.publish('posPromotionQty', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.PromotionQuantities.find(selector, {removed: true});
    }
});
Meteor.publish('posPromotionTotalAmount', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.PromotionTotalAmounts.find(selector, {removed: true});
    }
});
Meteor.publish('posPromotionPercentage', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.PromotionPercentages.find(selector, {removed: true});
    }
});
Meteor.publish('posFIFOInventory', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.FIFOInventory.find(selector, {removed: true});
    }
});
Meteor.publish('posLIFOInventory', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.LIFOInventory.find(selector, {removed: true});
    }
});
Meteor.publish('posAverageInventory', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.AverageInventory.find(selector, {removed: true});
    }
});

Meteor.publish('posLocation', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.Locations.find(selector, {removed: true});
    }
});
Meteor.publish('posLocationTransfer', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.LocationTransfers.find(selector, {removed: true});
    }
});
Meteor.publish('posLocationTransferDetail', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.LocationTransferDetails.find(selector, {removed: true});
    }
});

Meteor.publish('posLocationSetting', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.LocationSettings.find(selector, {removed: true});
    }
});
Meteor.publish('posOwedSale', function () {
    var lastWeek = new Date();
    var a=lastWeek.setDate(lastWeek.getDate() - 7);
    Counts.publish(this, 'owedSale', Pos.Collection.Sales.find({
        status: 'Owed',
        saleDate: {$lte: lastWeek}
    }));
    this.ready();
});

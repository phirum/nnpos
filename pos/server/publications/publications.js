Meteor.publish('posCategory', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.Categories.find(selector);
    }
});

Meteor.publish('posCustomer', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.Customers.find(selector);
    }
});

Meteor.publish('posSubCategory', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.SubCategories.find(selector);
    }
});
Meteor.publish('posUnit', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.Units.find(selector);
    }
});
Meteor.publish('posStaff', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.Staffs.find(selector);
    }
});

Meteor.publish('posSupplier', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.Suppliers.find(selector);
    }
});
Meteor.publish('posProduct', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.Products.find(selector);
    }
});

Meteor.publish('posSale', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.Sales.find(selector);
    }
});
Meteor.publish('posSaleDetail', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.SaleDetails.find(selector);
    }
});
Meteor.publish('posPayment', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.Payments.find(selector);
    }
});
Meteor.publish('posPurchase', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.Purchases.find(selector);
    }
});
Meteor.publish('posPurchaseDetail', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.PurchaseDetails.find(selector);
    }
});
Meteor.publish('posStock', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.Stocks.find(selector);
    }
});
Meteor.publish('posExchangeRate', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.ExchangeRates.find(selector);
    }
});
Meteor.publish('posStockHistory', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.StockHistories.find(selector);
    }
});

Meteor.publish('posUserStaff', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.UserStaffs.find(selector);
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
        return Pos.Collection.AdjustmentDetails.find(selector);
    }
});
Meteor.publish('posAdjustment', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.Adjustments.find(selector);
    }
});
Meteor.publish('posPromotion', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.Promotions.find(selector);
    }
});
Meteor.publish('posPromotionQty', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.PromotionQuantities.find(selector);
    }
});
Meteor.publish('posPromotionTotalAmount', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.PromotionTotalAmounts.find(selector);
    }
});
Meteor.publish('posPromotionPercentage', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.PromotionPercentages.find(selector);
    }
});
Meteor.publish('posFIFOInventory', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.FIFOInventory.find(selector);
    }
});
Meteor.publish('posLIFOInventory', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.LIFOInventory.find(selector);
    }
});
Meteor.publish('posAverageInventory', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.AverageInventory.find(selector);
    }
});

Meteor.publish('posLocation', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.Locations.find(selector);
    }
});
Meteor.publish('posLocationTransfer', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.LocationTransfers.find(selector);
    }
});
Meteor.publish('posLocationTransferDetail', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.LocationTransferDetails.find(selector);
    }
});

Meteor.publish('posLocationSetting', function (selector) {
    if (this.userId) {
        selector = selector == null ? {} : selector;
        return Pos.Collection.LocationSettings.find(selector);
    }
});
Meteor.publish('posOwedSale', function () {
    var lastWeek = new Date();
    var a = lastWeek.setDate(lastWeek.getDate() - 7);
    Counts.publish(this, 'owedSale', Pos.Collection.Sales.find({
        status: 'Owed',
        saleDate: {$lte: lastWeek}
    }));
    this.ready();
});


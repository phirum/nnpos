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
    }
});
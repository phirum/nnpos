Meteor.methods({
    //Sale
    insertSaleAndSaleDetail: function (sale, saleDetail) {
        var todayDate = moment().format('YYYYMMDD');
        var prefix = sale.branchId + "-" + todayDate;
        var saleId= idGenerator.genWithPrefix(Pos.Collection.Sales, prefix, 4);
        sale._id=saleId;
        Pos.Collection.Sales.insert(sale);
        saleDetail.saleId = saleId;
        Pos.Collection.SaleDetails.insert(saleDetail);
        return saleId;
    },
    insertSale: function (obj) {
        return Pos.Collection.Sales.insert(obj);
    },
    directInsertSale:function(obj){
        return Pos.Collection.Sales.direct.insert(obj);
    },
    directUpdateSale:function(id,set){
        Pos.Collection.Sales.direct.update(id,{$set:set});
    },
    updateSale: function (id, set) {
        Pos.Collection.Sales.update(id, {$set: set});
    },
    directInsertSaleDetails:function(obj){
        Pos.Collection.SaleDetails.direct.insert(obj);
    },
    insertSaleDetails: function (obj) {
        Pos.Collection.SaleDetails.insert(obj);
    },
    directUpdateSaleDetails:function(id,set){
        Pos.Collection.SaleDetails.direct.update(id,{$set:set});
    },
    updateSaleDetails: function (id, set) {
        Pos.Collection.SaleDetails.update(id, {$set: set});
    },
    cancelSale: function (saleId) {
        //Pos.Collection.SaleDetails.remove({saleId: saleId});
        Pos.Collection.Sales.remove(saleId);
    },
    updateToRetailSale:function(saleId){
        Pos.Collection.SaleDetails.find({saleId: saleId}).forEach(function (sd) {
            var retailPrice = Pos.Collection.Products.findOne(sd.productId).retailPrice;
            var detailObj = {};
            detailObj.price = retailPrice;
            detailObj.amount = (detailObj.price * sd.quantity) * (1 - sd.discount / 100);
            Pos.Collection.Sales.direct.update(sd._id, {$set: detailObj});
        });
        var set={};
        set.isRetail = true;
        Pos.Collection.Sales.update(saleId, {$set: set});
    }
});
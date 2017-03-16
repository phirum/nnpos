//Sale

/*Pos.Collection.Sales.before.insert(function(userId,doc){
 var todayDate = moment().format('YYYYMMDD');
 var prefix = doc.branchId + "-" + todayDate;
 doc._id= idGenerator.genWithPrefix(Pos.Collection.Sales, prefix, 4);
 });*/



//SaleDetail
/*Pos.Collection.Sales.after.insert(function (userId, doc) {
 //for promotion percentage
 Meteor.defer(function () {

 var saleTime=moment(doc.saleDate).format("HH:mm");
 var selector = {};
 selector.startDate = {$lte: doc.saleDate};
 selector.endDate = {$gte: doc.saleDate};
 selector.startTime={$lte:saleTime};
 selector.endTime={$gte:saleTime};
 var promotionPercentage = Pos.Collection.PromotionPercentages.findOne(selector);
 var discount = promotionPercentage.percentage;
 var saleSubTotal = doc.subTotal;
 var baseCurrencyId = Cpanel.Collection.Setting.findOne().baseCurrency;
 var total = saleSubTotal * (1 - discount / 100);
 if (baseCurrencyId == "KHR") {
 total = roundRielCurrency(total);
 }
 var set = {};
 set.subTotal = saleSubTotal;
 set.total = total;
 set.discount = discount;
 Pos.Collection.Sales.direct.update(doc._id, {$set: set});
 });
 });*/

Pos.Collection.SaleDetails.before.insert(function (user, doc) {
    doc._id = idGenerator.genWithPrefix(Pos.Collection.SaleDetails, doc.saleId, 3);
});

Pos.Collection.SaleDetails.after.remove(function (userId, doc) {
    var sale = Pos.Collection.Sales.findOne(doc.saleId);
    if (sale != null) {
        updateSaleTotal(doc.saleId);
        removePromotionProduct(doc);
    }

});

Pos.Collection.SaleDetails.after.insert(function (userId, doc) {
    updateSaleTotal(doc.saleId);
    Meteor.defer(function () {
        var sale = Pos.Collection.Sales.findOne(doc.saleId);
        var saleDate = sale.saleDate;
        checkPromotion(doc, saleDate);
    });
});

Pos.Collection.SaleDetails.after.update(function (userId, doc, fieldNames, modifier, options) {
    updateSaleTotal(doc.saleId);
    Meteor.defer(function () {
        var sale = Pos.Collection.Sales.findOne(doc.saleId);
        var saleDate = sale.saleDate;
        checkPromotion(doc, saleDate);
    });
});

Pos.Collection.Sales.after.update(function (userId, doc, fieldNames, modifier, options) {
    updateSaleTotal(doc._id);
    Meteor.defer(function () {
        var saleDetails = Pos.Collection.SaleDetails.find({saleId: doc._id});
        saleDetails.forEach(function (saleDetail) {
            checkPromotion(saleDetail, doc.saleDate);
        })
    });

});
Pos.Collection.Sales.after.remove(function (userId, doc) {
    Meteor.defer(function () {
        returnToInventoryFun(doc._id,doc.branchId);
        Pos.Collection.SaleDetails.remove({saleId: doc._id});
    });

    //Pos.Collection.SaleDetails.direct.remove({saleId: doc._id});
});

function updateSaleTotal(saleId) {
    Meteor.defer(function () {
        var set = {};
        //var discount = Pos.Collection.Sales.findOne(saleId).discountAmount;
        var sale = Pos.Collection.Sales.findOne(saleId);
        var discount = sale && sale.discount ? sale.discount : 0;
        var saleSubTotal = 0;
        var saleDetails = Pos.Collection.SaleDetails.find({saleId: saleId});
        saleDetails.forEach(function (saleDetail) {
            saleSubTotal += parseFloat(saleDetail.amount);
        });
        var saleDate = sale.saleDate;
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
        } else if (promotionPercentage != null) {
            discount = promotionPercentage.percentage;
        }/* else {
            discount = 0;
        }*/
        set.discount = math.round(discount, 2);
        //----have to check-----
        var baseCurrencyId = Cpanel.Collection.Setting.findOne().baseCurrency;
        //var total = saleSubTotal - discount;
        saleSubTotal = math.round(saleSubTotal, 2);
        var total = saleSubTotal * (1 - discount / 100);
        if (baseCurrencyId == "KHR") {
            total = roundRielCurrency(total);
        } else {
            total = math.round(total, 2);
        }
        var discountAmount = saleSubTotal * discount / 100;

        set.subTotal = saleSubTotal;
        set.total = total;
        set.discountAmount = math.round(discountAmount, 2);
        set.owedAmount = total;
        //set.discountAmount=saleSubTotal-total;
        Pos.Collection.Sales.direct.update(saleId, {$set: set});
        //Meteor.call('updateSale', saleId, set);
    });
}

function sortArrayByKey(array, key) {
    return array.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}


function removePromotionProduct(doc) {
    Meteor.defer(function () {
        if (!doc.isPromotion) {
            var sale = Pos.Collection.Sales.findOne(doc.saleId);
            var saleDate = sale.saleDate;
            //var today = moment().toDate();
            var saleTime = moment(saleDate).format("HH:mm");
            var selector = {};
            selector.productId = doc.productId;
            selector.startDate = {$lte: saleDate};
            selector.endDate = {$gte: saleDate};
            selector.startTime = {$lte: saleTime};
            selector.endTime = {$gte: saleTime};
            var promotionQty = Pos.Collection.PromotionQuantities.findOne(selector);
            if (promotionQty != null) {
                promotionQty.promotionItems.forEach(function (pro) {
                    var selector = {
                        promotionFromProductId: doc.productId,
                        productId: pro.productId,
                        saleId: doc.saleId,
                        isPromotion: true
                    };
                    var productPromotion = Pos.Collection.SaleDetails.findOne(selector);
                    if (productPromotion != null) {
                        Pos.Collection.SaleDetails.direct.remove(productPromotion._id);
                    }
                });
            }
        }
    });
}
function checkPromotion(saleDetail, saleDate) {
    /*var data = {
     message: []
     };*/
    if (!saleDetail.isPromotion) {
        //var today = moment().toDate();
        var saleTime = moment(saleDate).format("HH:mm");
        var selector = {};
        selector.productId = saleDetail.productId;
        selector.startDate = {$lte: saleDate};
        selector.endDate = {$gte: saleDate};
        selector.startTime = {$lte: saleTime};
        selector.endTime = {$gte: saleTime};
        var promotionQty = Pos.Collection.PromotionQuantities.findOne(selector);
        if (promotionQty != null) {
            var increase = parseInt(saleDetail.quantity / promotionQty.quantity);
            if (increase > 0) {
                promotionQty.promotionItems.forEach(function (pro) {
                    //check the promotion item quantity in stock is enough

                    // ---- FIFO Inventory -------------
                    var inventory = Pos.Collection.FIFOInventory.findOne({
                        branchId: saleDetail.branchId,
                        productId: pro.productId,
                        locationId: saleDetail.locationId
                    }, {sort: {createdAt: -1}});
                    var promotionQuantity = 0;
                    if (!inventory) {
                        return;
                    } else if (inventory.quantity <= 0) {
                        // data.message.push('Promotion Item is out of stock.' + pro.productId);
                        return;
                    }
                    else if (inventory.quantity < increase * pro.quantity) {
                        // data.message.push('Promotion Item is not enough.');
                        promotionQuantity = inventory.quantity;
                    } else {
                        promotionQuantity = increase * pro.quantity;
                    }

                    var selector = {
                        promotionFromProductId: saleDetail.productId,
                        productId: pro.productId,
                        saleId: saleDetail.saleId,
                        isPromotion: true
                    };
                    var productPromotion = Pos.Collection.SaleDetails.findOne(selector);
                    var saleDetailObj = {};
                    if (productPromotion == null) {
                        // saleDetailObj._id = idGenerator.genWithPrefix(Pos.Collection.SaleDetails, saleDetail.saleId, 3);
                        saleDetailObj.productId = pro.productId;
                        saleDetailObj.quantity = promotionQuantity;
                        saleDetailObj.discount = 0;
                        saleDetailObj.locationId = saleDetail.locationId;
                        saleDetailObj.imei = [];
                        saleDetailObj.status = "Unsaved";
                        saleDetailObj.price = 0;
                        //saleDetailObj.price = isRetail ? product.retailPrice : product.wholesalePrice;
                        saleDetailObj.amount = 0;
                        saleDetailObj.branchId = saleDetail.branchId;
                        saleDetailObj.saleId = saleDetail.saleId;
                        saleDetailObj.isPromotion = true;
                        saleDetailObj.promotionFromProductId = saleDetail.productId;
                        Pos.Collection.SaleDetails.insert(saleDetailObj);
                    } else {
                        saleDetailObj.quantity = promotionQuantity;
                        saleDetailObj.discount = 0;
                        saleDetailObj.price = 0;
                        saleDetailObj.amount = 0;
                        Pos.Collection.SaleDetails.direct.update(productPromotion._id, {$set: saleDetailObj});
                    }
                })
            } else {
                Pos.Collection.SaleDetails.direct.remove({
                    promotionFromProductId: saleDetail.productId,
                    isPromotion: true
                });
                /*promotionQty.promotionItems.forEach(function (pro) {
                 var selector = {
                 promotionFromProductId: saleDetail.productId,
                 productId: pro.productId,
                 saleId: saleDetail.saleId,
                 isPromotion: true
                 };
                 var productPromotion = Pos.Collection.SaleDetails.findOne(selector);
                 if (productPromotion != null) {
                 Pos.Collection.SaleDetails.direct.remove(productPromotion._id);
                 }
                 });*/
            }
        } else {
            Pos.Collection.SaleDetails.direct.remove({
                promotionFromProductId: saleDetail.productId,
                isPromotion: true
            });
        }
    }

}


 function returnToInventoryFun(saleId, branchId) {
        var prefix = branchId + '-';
        //Meteor.defer(function () {
        //---Open Inventory type block "FIFO Inventory"---
        var saleDetails = Pos.Collection.SaleDetails.find({saleId: saleId});
        saleDetails.forEach(function (sd) {
            sd.transaction.forEach(function (tr) {
                sd.price = tr.price;
                sd.quantity = tr.quantity;
                //fifoInventoryInsert(branchId,sd,prefix);
                var inventory = Pos.Collection.FIFOInventory.findOne({
                    branchId: branchId,
                    productId: sd.productId,
                    locationId: sd.locationId
                    //price: pd.price
                }, {sort: {createdAt: -1}});
                if (inventory == null) {
                    var inventoryObj = {};
                    inventoryObj._id = idGenerator.genWithPrefix(Pos.Collection.FIFOInventory, prefix, 13);
                    inventoryObj.branchId = branchId;
                    inventoryObj.productId = sd.productId;
                    inventoryObj.quantity = tr.quantity;
                    inventoryObj.locationId = sd.locationId;
                    inventoryObj.price = tr.price;
                    inventoryObj.imei = sd.imei;
                    inventoryObj.remainQty = tr.quantity;
                    inventoryObj.isSale = false;
                    Pos.Collection.FIFOInventory.insert(inventoryObj);
                }
                else if (inventory.price == tr.price) {
                    var inventorySet = {};
                    inventorySet.quantity = tr.quantity + inventory.quantity;
                    inventorySet.imei = inventory.imei.concat(sd.imei);
                    inventorySet.remainQty = inventory.remainQty + sd.quantity;
                    inventorySet.isSale = false;
                    Pos.Collection.FIFOInventory.update(inventory._id, {$set: inventorySet});
                }
                else {
                    var nextInventory = {};
                    nextInventory._id = idGenerator.genWithPrefix(Pos.Collection.FIFOInventory, prefix, 13);
                    nextInventory.branchId = branchId;
                    nextInventory.productId = sd.productId;
                    nextInventory.locationId = sd.locationId;
                    nextInventory.quantity = tr.quantity;
                    nextInventory.price = tr.price;
                    nextInventory.imei = inventory.imei.concat(sd.imei);
                    nextInventory.remainQty = inventory.remainQty + tr.quantity;
                    nextInventory.isSale = false;
                    Pos.Collection.FIFOInventory.insert(nextInventory);
                }
            });
            // });

        });
        //--- End Inventory type block "FIFO Inventory"---
        /*       return true;
         } catch (e) {
         throw new Meteor.Error(e.message);
         }*/
}
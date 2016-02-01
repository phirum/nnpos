/*function fifoInventoryInsert(branchId, pd, prefix) {
 //FIFO find the last record that has the same price
 var inventory = Pos.Collection.FIFOInventory.findOne({
 branchId: branchId,
 productId: pd.productId
 //price: pd.price
 }, {sort: {createdAt: -1}});
 if (inventory == null) {
 var inventoryObj = {};
 inventoryObj._id = idGenerator.genWithPrefix(Pos.Collection.FIFOInventory, prefix, 13);
 inventoryObj.branchId = branchId;
 inventoryObj.productId = pd.productId;
 inventoryObj.quantity = pd.quantity;
 inventoryObj.price = pd.price;
 inventoryObj.remainQty = pd.quantity;
 inventoryObj.isSale = false;
 inventoryObj.imei = pd.imei;
 Pos.Collection.FIFOInventory.insert(inventoryObj);
 }
 else if (inventory.price == pd.price) {
 var inventorySet = {};
 inventorySet.quantity = pd.quantity + inventory.quantity;
 inventorySet.remainQty = inventory.remainQty + pd.quantity;
 inventorySet.isSale = false;
 inventorySet.imei = (inventory.imei).concat(pd.imei);
 Pos.Collection.FIFOInventory.update(inventory._id, {$set: inventorySet});

 }
 else {
 var nextInventory = {};
 nextInventory._id = idGenerator.genWithPrefix(Pos.Collection.FIFOInventory, prefix, 13);
 nextInventory.branchId = branchId;
 nextInventory.productId = pd.productId;
 nextInventory.quantity = pd.quantity;
 nextInventory.price = pd.price;
 nextInventory.remainQty = inventory.remainQty + pd.quantity;
 nextInventory.isSale = false;
 nextInventory.imei = (inventory.imei).concat(pd.imei);
 Pos.Collection.FIFOInventory.insert(nextInventory);
 }
 }*/
function fifoInventoryInsert(branchId, pd, prefix) {
//FIFO find the last record that has the same price
    var inventory = Pos.Collection.FIFOInventory.findOne({
        branchId: branchId,
        productId: pd.productId,
        locationId: pd.locationId
        //price: pd.price
    }, {sort: {createdAt: -1}});
    if (inventory == null) {
        var inventoryObj = {};
        inventoryObj._id = idGenerator.genWithPrefix(Pos.Collection.FIFOInventory, prefix, 13);
        inventoryObj.branchId = branchId;
        inventoryObj.locationId = pd.locationId;
        inventoryObj.productId = pd.productId;
        inventoryObj.quantity = pd.quantity;
        inventoryObj.price = pd.price;
        inventoryObj.remainQty = pd.quantity;
        inventoryObj.isSale = false;
        inventoryObj.imei = pd.imei;
        Pos.Collection.FIFOInventory.insert(inventoryObj);
    }
    else if (inventory.price == pd.price) {
        var inventorySet = {};
        inventorySet.quantity = pd.quantity + inventory.quantity;
        inventorySet.remainQty = inventory.remainQty + pd.quantity;
        inventorySet.isSale = false;
        inventorySet.imei = (inventory.imei).concat(pd.imei);
        Pos.Collection.FIFOInventory.update(inventory._id, {$set: inventorySet});

    }
    else {
        var nextInventory = {};
        nextInventory._id = idGenerator.genWithPrefix(Pos.Collection.FIFOInventory, prefix, 13);
        nextInventory.branchId = branchId;
        nextInventory.locationId = pd.locationId;
        nextInventory.productId = pd.productId;
        nextInventory.quantity = pd.quantity;
        nextInventory.price = pd.price;
        nextInventory.remainQty = inventory.remainQty + pd.quantity;
        nextInventory.isSale = false;
        nextInventory.imei = (inventory.imei).concat(pd.imei);
        Pos.Collection.FIFOInventory.insert(nextInventory);
    }
}
function lifoInventoryInsert(branchId, pd, prefix) {
//LIFO find the last record that has the same price
    var inventory = Pos.Collection.FIFOInventory.findOne({
        branchId: branchId,
        productId: pd.productId
        //price: pd.price
    }, {sort: {createdAt: 1}});

    var lastRecord = Pos.Collection.FIFOInventory.findOne({
        branchId: branchId,
        productId: pd.productId
        //price: pd.price
    }, {sort: {createdAt: 1}});

    if (inventory == null) {
        var inventoryObj = {};
        inventoryObj._id = idGenerator.genWithPrefix(Pos.Collection.FIFOInventory, prefix, 13);
        inventoryObj.branchId = branchId;
        inventoryObj.productId = pd.productId;
        inventoryObj.quantity = pd.quantity;
        inventoryObj.price = pd.price;
        inventoryObj.imei = pd.imei;
        inventoryObj.remainQty = pd.quantity;
        inventoryObj.isSale = false;
        Pos.Collection.FIFOInventory.insert(inventoryObj);
    }
    else if (inventory.price == pd.price) {
        var inventorySet = {};
        inventorySet.quantity = pd.quantity + inventory.quantity;
        inventorySet.imei = inventory.imei.concat(pd.imei);
        inventorySet.remainQty = inventory.remainQty + pd.quantity;
        inventorySet.isSale = false;
        Pos.Collection.FIFOInventory.update(inventory._id, {$set: inventorySet});

    }
    else {
        var nextInventory = {};
        nextInventory._id = idGenerator.genWithPrefix(Pos.Collection.FIFOInventory, prefix, 13);
        nextInventory.branchId = branchId;
        nextInventory.productId = pd.productId;
        nextInventory.quantity = pd.quantity;
        nextInventory.price = pd.price;
        nextInventory.imei = inventory.imei.concat(pd.imei);
        nextInventory.remainQty = inventory.remainQty + pd.quantity;
        nextInventory.isSale = false;
        Pos.Collection.FIFOInventory.insert(nextInventory);
    }
}
function sortArrayByKey(array, key) {
    return array.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
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
/*
 function subtractArray1(a, b) {
 var result = [], found;
 for (var i = 0; i < a.length; i++) {
 found = false;
 // find a[i] in b
 for (var j = 0; j < b.length; j++) {
 if (a[i] == b[j]) {
 found = true;
 break;
 }
 }
 if (!found) {
 result.push(a[i]);
 }
 }
 return result;
 }
 */
Meteor.methods({
    insertStock: function (obj) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        Pos.Collection.Stocks.insert(obj);
    },
    directInsertStock: function (obj) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        Pos.Collection.Stocks.direct.insert(obj);
    },
    updateStock: function (id, set, unset) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        var updateObject = {};
        if (set != null) updateObject.$set = set;
        if (unset != null) updateObject.$unset = unset;
        Pos.Collection.Stocks.update(id, updateObject);
    },
    directUpdateStock: function (id, set, unset) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        var updateObject = {};
        if (set != null) updateObject.$set = set;
        if (unset != null) updateObject.$unset = unset;
        Pos.Collection.Stocks.direct.update(id, updateObject);
    },
    insertStockHistory: function (branchId) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
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
    },
    purchaseManageStock: function (purchaseId, branchId) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        Meteor.defer(function () {
            //---Open Inventory type block "FIFO Inventory"---
            var purchaseDetails = Pos.Collection.PurchaseDetails.find({purchaseId: purchaseId});
            var prefix = branchId + "-";
            purchaseDetails.forEach(function (pd) {
                // var product=Pos.Collection.Products.findOne(pd.productId);
                var productSet = {};
                productSet.purchasePrice = pd.price;
                Pos.Collection.Products.direct.update(pd.productId, {$set: productSet});
                fifoInventoryInsert(branchId, pd, prefix);
            });
            //--- End Inventory type block "FIFO Inventory"---
            Pos.Collection.PurchaseDetails.direct.update({purchaseId: purchaseId}, {$set: {status: "Saved"}}, {multi: true});
        });
    },
    saleManageStock: function (saleId, branchId) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        Meteor.defer(function () {
            //---Open Inventory type block "FIFO Inventory"---
            var saleTotalCost = 0;
            var saleDetails = Pos.Collection.SaleDetails.find({saleId: saleId});
            var prefix = branchId + "-";
            saleDetails.forEach(function (sd) {
                    var transaction = [];
                    var inventories = Pos.Collection.FIFOInventory.find({
                        branchId: branchId,
                        productId: sd.productId,
                        locationId: sd.locationId,
                        isSale: false
                    }, {sort: {_id: 1}}).fetch();
                    var enoughQuantity = sd.quantity;
                    for (var i = 0; i < inventories.length; i++) {
                        //or if(enoughQuantity==0){ return false; //to stop the loop.}
                        var inventorySet = {};
                        var remainQty = (inventories[i].remainQty - sd.quantity);
                        var quantityOfThisPrice = 0;
                        if (remainQty <= 0) {
                            inventorySet.remainQty = 0;
                            inventorySet.isSale = true;
                            if ((inventories[i].remainQty - inventories[i].quantity) >= 0) {
                                quantityOfThisPrice = inventories[i].quantity - 0;
                            } else {
                                quantityOfThisPrice = inventories[i].remainQty - 0;
                            }
                        } else {
                            inventorySet.remainQty = remainQty;
                            inventorySet.isSale = false;
                            quantityOfThisPrice = inventories[i].quantity - remainQty;
                        }
                        if (enoughQuantity != 0) {
                            if (quantityOfThisPrice > 0) {
                                transaction.push({quantity: quantityOfThisPrice, price: inventories[i].price})
                            }
                        }
                        enoughQuantity -= quantityOfThisPrice;
                        if (i == inventories.length - 1) {
                            inventorySet.imei = subtractImeiArray(inventories[i].imei, sd.imei);
                        }
                        Pos.Collection.FIFOInventory.update(inventories[i]._id, {$set: inventorySet});
                        // var quantityOfThisPrice = inventories[i].quantity - remainQty;

                    }
                    var setObj = {};
                    setObj.transaction = transaction;
                    setObj.totalCost = 0;
                    setObj.status = "Saved";
                    if (transaction.count() > 0) {
                        transaction.forEach(function (t) {
                            setObj.totalCost += parseFloat(t.price) * parseFloat(t.quantity);
                        });
                    }
                    saleTotalCost += setObj.totalCost;
                    Pos.Collection.SaleDetails.direct.update(
                        sd._id,
                        {$set: setObj}
                    );
                    //inventories=sortArrayByKey()
                }
            );
            Pos.Collection.Sales.direct.update(
                saleId,
                {$set: {totalCost: saleTotalCost}}
            );
            //--- End Inventory type block "FIFO Inventory"---
        });
    },
    locationTransferManageStock: function (locationTransferId, branchId) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        Meteor.defer(function () {
            //---Open Inventory type block "FIFO Inventory"---
            var locationTransferTotalCost = 0;
            var locationTransferDetails = Pos.Collection.LocationTransferDetails.find({locationTransferId: locationTransferId});
            var prefix = branchId + "-";
            locationTransferDetails.forEach(function (ltd) {
                    var transaction = [];
                    var inventories = Pos.Collection.FIFOInventory.find({
                        branchId: branchId,
                        productId: ltd.productId,
                        locationId: ltd.fromLocationId,
                        isSale: false
                    }, {sort: {_id: 1}}).fetch();
                    //var enoughQuantity = ltd.quantity;
                    for (var i = 0; i < inventories.length; i++) {
                        //or if(enoughQuantity==0){ return false; //to stop the loop.}
                        var inventorySet = {};
                        var remainQty = (inventories[i].remainQty - ltd.quantity);
                        var quantityOfThisPrice = 0;
                        if (remainQty <= 0) {
                            inventorySet.remainQty = 0;
                            inventorySet.isSale = true;
                            if ((inventories[i].remainQty - inventories[i].quantity) >= 0) {
                                quantityOfThisPrice = inventories[i].quantity - 0;
                            } else {
                                quantityOfThisPrice = inventories[i].remainQty - 0;
                            }
                        }
                        else {
                            inventorySet.remainQty = remainQty;
                            inventorySet.isSale = false;
                            quantityOfThisPrice = inventories[i].quantity - remainQty;
                        }
                        //if (enoughQuantity != 0) {
                        if (quantityOfThisPrice > 0) {
                            transaction.push({quantity: quantityOfThisPrice, price: inventories[i].price});
                            // transaction.push({quantity: quantityOfThisPrice, price: inventories[i].price})
                            var purchaseDetailObj = {};
                            purchaseDetailObj.locationId = ltd.toLocationId;
                            purchaseDetailObj.productId = ltd.productId;
                            purchaseDetailObj.quantity = quantityOfThisPrice;
                            purchaseDetailObj.price = inventories[i].price;
                            purchaseDetailObj.imei = ltd.imei;
                            fifoInventoryInsert(branchId, purchaseDetailObj, prefix);
                        }
                        //}
                        //enoughQuantity -= quantityOfThisPrice;
                        if (i == inventories.length - 1) {
                            inventorySet.imei = subtractImeiArray(inventories[i].imei, ltd.imei);
                        }
                        Pos.Collection.FIFOInventory.update(inventories[i]._id, {$set: inventorySet});
                        // var quantityOfThisPrice = inventories[i].quantity - remainQty;
                    }
                    var setObj = {};
                    setObj.transaction = transaction;
                    setObj.status = "Saved";
                    Pos.Collection.LocationTransferDetails.direct.update(
                        ltd._id,
                        {$set: setObj}
                    );
                    //inventories=sortArrayByKey()
                }
            );
            //--- End Inventory type block "FIFO Inventory"---
        });
    },
    returnToInventory: function (saleId, branchId) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        Meteor.defer(function () {
            //---Open Inventory type block "FIFO Inventory"---
            var saleDetails = Pos.Collection.SaleDetails.find({saleId: saleId});
            saleDetails.forEach(function (sd) {
                sd.transaction.forEach(function (tr) {
                    sd.price = tr.price;
                    sd.quantity = tr.quantity;
                    //fifoInventoryInsert(branchId,sd,prefix);
                    var inventory = Pos.Collection.FIFOInventory.findOne({
                        branchId: branchId,
                        productId: sd.productId
                        //price: pd.price
                    }, {sort: {createdAt: -1}});
                    if (inventory == null) {
                        var inventoryObj = {};
                        inventoryObj._id = idGenerator.genWithPrefix(Pos.Collection.FIFOInventory, prefix, 13);
                        inventoryObj.branchId = branchId;
                        inventoryObj.productId = sd.productId;
                        inventoryObj.quantity = tr.quantity;
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
                        nextInventory.quantity = tr.quantity;
                        nextInventory.price = tr.price;
                        nextInventory.imei = inventory.imei.concat(sd.imei);
                        nextInventory.remainQty = inventory.remainQty + tr.quantity;
                        nextInventory.isSale = false;
                        Pos.Collection.FIFOInventory.insert(nextInventory);
                    }
                });
            });
            //--- End Inventory type block "FIFO Inventory"---
        });
    }
});


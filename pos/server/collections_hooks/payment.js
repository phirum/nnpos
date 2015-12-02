Pos.Collection.Payments.before.insert(function (userId, doc) {
    var prefix;
    prefix = doc.saleId ? doc.saleId + "S" : doc.purchaseId + "P";
    doc._id = idGenerator.genWithPrefix(Pos.Collection.Payments, prefix, 3);
});

Pos.Collection.Payments.after.remove(function (userId, doc) {
    Meteor.defer(function () {
        if (doc.saleId) {
            var saleObj = {};
            saleObj.owedAmount = doc.dueAmount;
            saleObj.status = "Owed";
            Pos.Collection.Sales.direct.update(doc.saleId, {$set: saleObj});
        } else {
            var purchaseObj = {};
            purchaseObj.owedAmount = doc.dueAmount;
            purchaseObj.status = "Owed";
            Pos.Collection.Purchases.direct.update(doc.purchaseId, {$set: purchaseObj});
        }
    });

});

Pos.Collection.Payments.after.insert(function (userId, doc) {
    Meteor.defer(function () {
        if (doc.saleId) {
            var saleObj = {};
            //var sale=Pos.Collection.Sales.findOne(doc.saleId);
            if (doc.balanceAmount <= 0) {
                saleObj.status = "Paid";
                saleObj.owedAmount = 0;
               // saleObj.PaidAmount=
            } else {
                saleObj.status = "Owed";
                saleObj.owedAmount = doc.balanceAmount
            }
            Pos.Collection.Sales.direct.update(doc.saleId, {$set: saleObj});
        } else {
            var purchaseObj = {};
            if (doc.balanceAmount <= 0) {
                purchaseObj.status = "Paid";
                purchaseObj.owedAmount = 0;
            } else {
                purchaseObj.status = "Owed";
                purchaseObj.owedAmount = doc.balanceAmount
            }
            Pos.Collection.Purchases.direct.update(doc.purchaseId, {$set: purchaseObj});
        }
    });
});

Pos.Collection.Payments.after.update(function (userId, doc, fieldNames, modifier, options) {
    Meteor.defer(function () {
        if (doc.saleId) {
            var saleObj = {};
            if (doc.balanceAmount <= 0) {
                saleObj.status = "Paid";
                saleObj.owedAmount = 0;
            } else {
                saleObj.status = "Owed";
                saleObj.owedAmount = doc.balanceAmount;
            }
            Pos.Collection.Sales.direct.update(doc.saleId, {$set: saleObj});
        } else {
            var purchaseObj = {};
            if (doc.balanceAmount <= 0) {
                purchaseObj.status = "Paid";
                purchaseObj.owedAmount = 0;
            } else {
                purchaseObj.status = "Owed";
                purchaseObj.owedAmount = doc.balanceAmount
            }
            Pos.Collection.Purchases.direct.update(doc.purchaseId, {$set: purchaseObj});
        }
    });
});

/*
 Pos.Collection.Sales.after.update(function(userId,doc,fieldNames,modifier,options){
 updateSaleTotal(doc._id);
 },{fetchPrevious: true});

 */


/*
 var updateSaleStatusAndPaidAmount =function(saleId){

 };

 if (balanceAmount >= 0) {
 obj.status = "Paid";
 setObj.status = "Paid";
 } else {
 obj.status = "Owed";
 setObj.status = "Owed";
 }
 obj.branchId = branchId;
 Meteor.call('insertPayment', obj);
 setObj.status = "Owed";*/

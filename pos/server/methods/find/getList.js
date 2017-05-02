Meteor.methods({
    getList: function (collectionName, selector, option, hasSelectOne) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        var arr = [];
        if (hasSelectOne) {
            arr.push({value: "", label: "(Select One)"});
        }
        collectionName = eval(collectionName);
        selector = selector == null ? {} : selector;
        option = option == null ? {} : option;
        collectionName.find(selector, option).forEach(function (obj) {
            arr.push({value: obj._id, label: obj._id + " | " + obj.name});
        });
        return arr;
    },
    getProductPurchasePrice: function (productId) {
        var purchaseDetails = Pos.Collection.PurchaseDetails.find({productId: productId});
        var list = [];
        var i=1;
        purchaseDetails.forEach(function (pd) {
            var purchase = Pos.Collection.Purchases.findOne(pd.purchaseId);
            purchase.price = pd.price;
            purchase.order=i;
            purchase.purchaseDate=moment(purchase.purchaseDate).format('DD-MM-YYYY');
            list.push(purchase);
            i++;
        });
        return list;
    },
    getProductSalePrice:function (productId) {
        var saleDetails = Pos.Collection.SaleDetails.find({productId: productId});
        var list = [];
        var i=1;
        saleDetails.forEach(function (pd) {
            var sale = Pos.Collection.Sales.findOne(pd.saleId);
            sale.price = pd.price;
            sale.order=i;
            sale.saleDate=moment(sale.saleDate).format('DD-MM-YYYY');
            list.push(sale);
            i++;
        });
        return list;
    }
});
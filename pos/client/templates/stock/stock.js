function getStockList(qty, products, branches) {
    products = Pos.Collection.Products.find();
    branches = Cpanel.Collection.Branch.find();
    var stockList = [];
    branches.forEach(function (b) {
        products.forEach(function (p) {
            var stock = Pos.Collection.Stocks.findOne({productId: p._id, branchId: b._id});
            var quantity = stock != null ? stock.quantity : 0;
            stockList.push({
                productId: p._id,
                productName: p.name,
                retailPrice: p.retailPrice,
                wholesalePrice: p.wholesalePrice,
                purchasePrice: p.purchasePrice,
                quantity: quantity,
                branchId: b._id,
                branchName: b.enName,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        });

    });
    //return remove none necessary object in array of object
    //var st=$.grep(stockList, function(s){ return s.quantity <=3 ; });
    return stockList;
}

Template.pos_stock.helpers({
    selector: function () {
        //return {status:"enable",productType:"Stock"};
        return {productType: "Stock"}
    },
    stocks: function () {
        var products = Pos.Collection.Products.find();
        // branches = Cpanel.Collection.Branch.find();
        var b = Cpanel.Collection.Branch.findOne(Session.get('currentBranch'));
        var stockList = [];
        //  branches.forEach(function (b) {
        products.forEach(function (p) {
            var stock = Pos.Collection.Stocks.findOne({productId: p._id, branchId: b._id});
            var quantity = stock != null ? stock.quantity : 0;
            stockList.push({
                productId: p._id,
                productName: p.name,
                retailPrice: p.retailPrice,
                wholesalePrice: p.wholesalePrice,
                purchasePrice: p.purchasePrice,
                quantity: quantity,
                branchId: b._id,
                branchName: b.enName,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        });

        //  });
        //return remove none necessary object in array of object
        //var st=$.grep(stockList, function(s){ return s.quantity <=3 ; });
        return stockList;
    }
});

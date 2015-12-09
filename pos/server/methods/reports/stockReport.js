Meteor.methods({
    posStockReport: function (arg) {
        var data = {
            title: {},
            header: {},
            content: [{index: 'No Result'}],
            footer: {}
        };
        var params = {};
        // var date=new Date(this.date);
        var date = moment(arg.date + " 23:59:59").toDate();
        var locationId = arg.locationId;
        var categoryId = arg.categoryId;
        var branchId = arg.branch;
        var category = "All", location = "All";
        if (date != null) params.createdAt = {$lte: date};
        if (branchId != null && branchId != null) params.branchId = branchId;
        var locationIds = [];
        if (locationId != null && locationId != "") {
            locationIds.push(locationId);
            location = Pos.Collection.Locations.findOne(locationId).name;
        } else {
            locationIds = Pos.Collection.Locations.find({branchId: branchId}).map(function (l) {
                return l._id;
            });
        }
        var productSelector = {};
        if (categoryId != null && categoryId != "") {
            category = Pos.Collection.Categories.findOne(categoryId).name;
            var categoryIds = getCategoryIdAndChildrenIds(categoryId, [categoryId]);
            productSelector.categoryId = {$in: categoryIds};
        }
        data.title = Cpanel.Collection.Company.findOne();
        var header = {};
        header.category = category;
        header.location = location;
        header.branch = Cpanel.Collection.Branch.findOne(branchId).enName;
        header.date = arg.date;
        data.header = header;
        var stockArray = [];
        var i = 1;
        var products = Pos.Collection.Products.find(productSelector);
        var content = [];

        for(var j=0;j<locationIds.length;j++){
            products.forEach(function (p) {
                var item = {};
                var inventory = Pos.Collection.FIFOInventory.findOne({
                    branchId: branchId,
                    productId: p._id,
                    locationId: locationIds[j],
                    createdAt: {$lte: date}
                }, {sort: {createdAt: -1, _id: -1}});
                if (inventory != null) {
                    item = inventory;
                    item.productName = inventory._product.name + ' (' + inventory._product._unit.name + ')';
                    //item.branchName = inventory._branch.enName;
                    item.locationName= inventory._location.name;
                } else {
                    item.productName = p.name + ' (' + p._unit.name + ')';
                    //item.branchName = Cpanel.Collection.Branch.findOne(branchId).enName;
                    item.locationName=Pos.Collection.Locations.findOne(locationIds[j]).name;
                    item.remainQty = 0;
                    item.price = p.purchasePrice;
                }
                item.order = i;
                i++;
                content.push(item);
            });
        }



        /*     var stockHistories = Pos.Collection.StockHistories.findOne(params, {sort: {createdAt: -1}});
         if (stockHistories != null) {
         var branchName = Cpanel.Collection.Branch.findOne(stockHistories.branchId).enName;
         stockHistories.stockList.forEach(function (stockObj) {
         var product = Pos.Collection.Products.findOne(stockObj.productId);
         stockObj.order = i;
         i++;
         stockObj.productName = product.name;
         stockObj.barcode = product.barcode;
         stockObj.purchasePrice = product.purchasePrice;
         stockObj.branchName = branchName;
         stockArray.push(stockObj);
         });
         }
         var content = stockArray;*/
        if (content.length > 0) {
            data.content = content;
        }
        return data;
    }
});

function getCategoryIdAndChildrenIds(id, arr) {
    var categories = Pos.Collection.Categories.find({parentId: id});
    if (categories != null) {
        categories.forEach(function (cat) {
            arr.push(cat._id);
            return getCategoryIdAndChildrenIds(cat._id, arr);
        });
    }
    return arr;
}

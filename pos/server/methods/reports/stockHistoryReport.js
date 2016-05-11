Meteor.methods({
    posStockHistoryReport: function (arg) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
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
        var categoryIds = [];
        if (categoryId != null && categoryId != "") {
            category = Pos.Collection.Categories.findOne(categoryId).name;
            categoryIds = getCategoryIdAndChildrenIds(categoryId, [categoryId]);
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
        var stockHistory = Pos.Collection.StockHistories.findOne(params, {sort: {_id: -1}});
        var content = [];
        if (stockHistory != null && stockHistory.stockList != null) {
            if (locationIds.length > 0) {
                if (categoryIds.length > 0) {
                    stockHistory.stockList.forEach(function (stock) {
                        if (locationIds.indexOf(stock.locationId) != -1 && categoryIds.indexOf(stock.categoryId)!=-1) {
                            stock.order = i;
                            i++;
                            content.push(stock);
                        }
                    });
                } else {
                    stockHistory.stockList.forEach(function (stock) {
                        if (locationIds.indexOf(stock.locationId) != -1) {
                            stock.order = i;
                            i++;
                            content.push(stock);
                        }
                    });
                }
            } else {
                if (categoryIds.length > 0) {
                    stockHistory.stockList.forEach(function (stock) {
                        if (categoryIds.indexOf(stock.categoryId)!=-1) {
                            stock.order = i;
                            i++;
                            content.push(stock);
                        }
                    });
                } else {
                    stockHistory.stockList.forEach(function (stock) {
                        stock.order = i;
                        i++;
                        content.push(stock);
                    });
                }
            }

        }
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

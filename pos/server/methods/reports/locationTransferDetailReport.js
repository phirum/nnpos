Meteor.methods({
    posLocationTransferDetailReport: function (arg) {
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
        var date = arg.date.split(" To ");
        var fromDate = moment(date[0] + " 00:00:00").toDate();
        var toDate = moment(date[1] + " 23:59:59").toDate();
        var staffId = arg.staffId;
        var branchId = arg.branch;
        var fromLocationId = arg.fromLocationId;
        var toLocationId = arg.toLocationId;
        var categoryId = arg.categoryId;
        var branchIds = [];
        if (branchId == "" || branchId == null) {
            //var userId = Meteor.userId();
            var userId = this.userId;
            branchIds = Meteor.users.findOne(userId).rolesBranch;
        } else {
            branchIds.push(branchId);
        }
        /****** Title *****/
        data.title = Cpanel.Collection.Company.findOne();

        if (fromDate != null && toDate != null) params.locationTransferDate = {$gte: fromDate, $lte: toDate};
        if (staffId != null && staffId != "") params.staffId = staffId;
        params.branchId = {$in: branchIds};
        //params.status = {$ne: "Unsaved"};
        params.status = arg.status;

        var header = {};
        var branchNames = "";
        branchIds.forEach(function (id) {
            branchNames += Cpanel.Collection.Branch.findOne(id).enName + ", ";
        });
        header.branch = branchNames.substr(0, branchNames.length - 2);
        header.date = arg.date;
        var staff = "All", fromLocation = "All", toLocation = "All", category = "All";
        if (staffId != null && staffId != "")
            staff = Pos.Collection.Staffs.findOne(staffId).name;
        if (fromLocationId != null && fromLocationId != "") {
            params.fromLocationId = fromLocationId;
            fromLocation = Pos.Collection.Locations.findOne(fromLocationId).name;
        }
        if (toLocationId != null && toLocationId != "") {
            params.toLocationId = toLocationId;
            toLocation = Pos.Collection.Locations.findOne(toLocationId).name;
        }
        if (categoryId != null && categoryId != "")
            category = Pos.Collection.Categories.findOne(categoryId).name;
        params.status = "Saved";

        header.staff = staff;
        header.fromLocation = fromLocation;
        header.toLocation = toLocation;
        header.category = category;
        // header.status = status;

        /****** Header *****/
        data.header = header;
        var content = getLocationTransferProducts(params, categoryId);

        //return reportHelper;
        /****** Content *****/
        if (content.length > 0) {
            data.content = content;
        }
        return data
    }
});


function getLocationTransferProducts(params, categoryId) {
    var locationTransferIds = Pos.Collection.LocationTransfers.find(params, {fields: {_id: 1}}).map(function (locationTransfer) {
        return locationTransfer._id;
    });

    var selectorObj = {};
    selectorObj.locationTransferId = {$in: locationTransferIds};

    if (categoryId != null && categoryId != "") {
        var categoryIds = getCategoryIdAndChildrenIds(categoryId, [categoryId]);
        var productIds = Pos.Collection.Products.find({
            categoryId: {$in: categoryIds}
        }, {fields: {_id: 1}}).map(function (p) {
            return p._id;
        });
        selectorObj.productId = {$in: productIds};
    }

    var result = [];
    var locationTransferDetails = Pos.Collection.LocationTransferDetails.find(
        selectorObj,
        {fields: {productId: 1, quantity: 1, price: 1, amount: 1, totalCost: 1, _product: 1}});
    (locationTransferDetails.fetch()).reduce(function (res, value) {
        if (!res[value.productId]) {
            res[value.productId] = {
                quantity: 0,
                productId: value.productId,
                _product: value._product
            };
            result.push(res[value.productId])
        }
        else {
            //res[value.productId].amount += value.amount;
            //res[value.productId].totalCost += value.totalCost;
        }
        res[value.productId].quantity += value.quantity;
        return res;
    }, {});
    var i = 1;
    var arr = [];
    result.forEach(function (r) {
        arr.push({
            order: i,
            productId: r.productId,
            productName: r._product.name + "(" + r._product._unit.name + ")",
            // price: numeral(r.price).format('0,0.00'),
            quantity: r.quantity
        });
        i++;
    });
    return arr;
}


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


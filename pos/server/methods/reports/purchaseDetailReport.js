Meteor.methods({
    posPurchaseDetailReport: function (arg) {
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
        var supplierId = arg.supplierId;
        var staffId = arg.staffId;
        var branchId = arg.branch;
        var locationId = arg.locationId;
        var categoryId = arg.categoryId;
        var branchIds = [];
        if (branchId == "" || branchId == null) {
            // var userId = Meteor.userId();
            var userId = this.userId;
            branchIds = Meteor.users.findOne(userId).rolesBranch;
        } else {
            branchIds.push(branchId);
        }
        data.title = Cpanel.Collection.Company.findOne();
        var staff = "All", supplier = "All", location = "All", category = "All";
        if (fromDate != null && toDate != null) {
            params.purchaseDate = {$gte: fromDate, $lte: toDate};
        }
        if (supplierId != null && supplierId != "") {
            params.supplierId = supplierId;
            supplier = Pos.Collection.Suppliers.findOne(supplierId).name;
        }
        if (staffId != null && staffId != "") {
            params.staffId = staffId;
            staff = Pos.Collection.Staffs.findOne(staffId).name;
        }
        if (locationId != null && locationId != "") {
            params.locationId = locationId;
            location = Pos.Collection.Locations.findOne(locationId).name;
        }
        if (categoryId != null && categoryId != "") {
            category = Pos.Collection.Categories.findOne(categoryId).name;
        }
        params.branchId = {$in: branchIds};
        params.status = {$ne: "Unsaved"};
        params.transactionType = "Purchase";
        var header = {};
        var branchNames = "";
        branchIds.forEach(function (id) {
            branchNames += Cpanel.Collection.Branch.findOne(id).enName + ", ";
        });
        header.branch = branchNames.substr(0, branchNames.length - 2);
        header.date = arg.date;
        header.staff = staff;
        header.supplier = supplier;
        header.location = location;
        header.category = category;
        data.header = header;


        var content = getPurchaseProducts(params, categoryId);
        data.grandTotal = content.grandTotal;

        if (content.length > 0) {
            data.content = content;
        }
        return data
    }
});

function getPurchaseProducts(params, categoryId) {
    var purchaseIds = Pos.Collection.Purchases.find(params, {fields: {_id: 1}}).map(function (purchase) {
        return purchase._id;
    });
    var selectorObj = {};
    selectorObj.purchaseId = {$in: purchaseIds};

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
    var purchaseDetails = Pos.Collection.PurchaseDetails.find(
        selectorObj,
        {fields: {productId: 1, quantity: 1, price: 1, amount: 1}});
    (purchaseDetails.fetch()).reduce(function (res, value) {
        if (!res[value.productId]) {
            res[value.productId] = {
                amount: value.amount,
                quantity: 0,
                productId: value.productId
            };
            result.push(res[value.productId])
        } else {
            res[value.productId].amount += value.amount;
        }
        res[value.productId].quantity += value.quantity;
        return res;
    }, {});
    var i = 1;
    var arr = [];
    var grandTotal = 0;
    result.forEach(function (r) {
        var product = Pos.Collection.Products.findOne(r.productId);
        grandTotal += r.amount;
        var unit = Pos.Collection.Units.findOne(product.unitId).name;
        arr.push({
            order: i,
            productId: r.productId,
            productName: product.name + "(" + unit + ")",
            // productName: product.name,
            // price: numeral(r.price).format('0,0.00'),
            quantity: r.quantity,
            total: numeral(r.amount).format('0,0.00')
        });
        i++;
    });
    arr.grandTotal = numeral(grandTotal).format('0,0.00');
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

Meteor.methods({
    posItemByCustomerReport: function (arg) {
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
        var customerId = arg.customerId;
        var staffId = arg.staffId;
        var branchId = arg.branch;
        var locationId = arg.locationId;
        var categoryId = arg.categoryId;
        var branchIds = [];
        var promotion = arg.itemType == null || arg.itemType == '' ? '' : arg.itemType;
        if (branchId == "" || branchId == null) {
            //var userId = Meteor.userId();
            var userId = this.userId;
            branchIds = Meteor.users.findOne(userId).rolesBranch;
        } else {
            branchIds.push(branchId);
        }
        /****** Title *****/
        data.title = Cpanel.Collection.Company.findOne();

        if (fromDate != null && toDate != null) params.saleDate = {$gte: fromDate, $lte: toDate};
        if (customerId != null && customerId != "") params.customerId = customerId;
        if (staffId != null && staffId != "") params.staffId = staffId;
        if (locationId != null && locationId != "") params.locationId = locationId;
        params.branchId = {$in: branchIds};
        //params.status = {$ne: "Unsaved"};
        params.status = arg.status;
        //params.transactionType = "Sale";
        params.transactionType = arg.transactionType;

        var header = {};
        var branchNames = "";
        branchIds.forEach(function (id) {
            branchNames += Cpanel.Collection.Branch.findOne(id).enName + ", ";
        });
        header.branch = branchNames.substr(0, branchNames.length - 2);
        header.date = arg.date;
        var staff = "All", customer = "All", location = "All", category = "All", status = "All", customerLocation = "All";
        if (customerId != null && customerId != "")
            customer = Pos.Collection.Customers.findOne(customerId).name;
        if (staffId != null && staffId != "")
            staff = Pos.Collection.Staffs.findOne(staffId).name;
        if (locationId != null && locationId != "")
            location = Pos.Collection.Locations.findOne(locationId).name;
        if (categoryId != null && categoryId != "")
            category = Pos.Collection.Categories.findOne(categoryId).name;

        if (arg.status != null && arg.status != "") {
            params.status = arg.status;
            status = arg.status;
        } else {
            params.status = {$ne: "Unsaved"};
        }
        if (arg.customerLocationId != null && arg.customerLocationId != "") {
            // params.customerLocationId = arg.customerLocationId;
            customerLocation = Pos.Collection.CustomerLocations.findOne(arg.customerLocationId).name;
        }

        header.customerLocation = customerLocation;
        header.staff = staff;
        header.customer = customer;
        header.location = location;
        header.category = category;
        header.status = status;
        header.transactionTyp = arg.transactionType;

        /****** Header *****/
        data.header = header;
        var getList = getSaleProducts(arg.customerLocationId, params, categoryId, promotion);
        data.grandTotal = getList.grandTotal;
        data.grandTotalCost = getList.grandTotalCost;
        //return reportHelper;
        /****** Content *****/
        if (getList.list.length > 0) {
            data.content = getList.list;
        }
        return data;
    }
});


function getSaleProducts(customerLocationId, params, categoryId, promotion) {
    var grandTotal = 0;
    var grandTotalCost = 0;
    var customerList = [];
    if (params.customerId == null || params.customerId == "") {
        var customerSelector = {};
        if (params.customerId != null && params.customerId != "") {
            customerSelector.customerLocationId = customerLocationId;
        }
        var customers = Pos.Collection.Customers.find(customerSelector, {sort: {name: 1}});
        customers.forEach(function (customer) {
            params.customerId = customer._id;
            var saleIds = Pos.Collection.Sales.find(params, {fields: {_id: 1}}).map(function (sale) {
                return sale._id;
            });
            var selectorObj = {};
            selectorObj.saleId = {$in: saleIds};
            if (promotion == 'true') {
                selectorObj.isPromotion = true;
            }
            else if (promotion == 'false') {
                selectorObj.isPromotion = {$ne: true};
            }
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
            var saleDetails = Pos.Collection.SaleDetails.find(
                selectorObj,
                {
                    sort: {'_product.name': 1},
                    fields: {productId: 1, quantity: 1, price: 1, amount: 1, totalCost: 1, _product: 1}
                });
            (saleDetails.fetch()).reduce(function (res, value) {
                if (!res[value.productId]) {
                    res[value.productId] = {
                        totalCost: value.totalCost,
                        amount: value.amount,
                        quantity: 0,
                        productId: value.productId,
                        _product: value._product
                    };
                    result.push(res[value.productId])
                } else {
                    res[value.productId].amount += value.amount;
                    res[value.productId].totalCost += value.totalCost;
                }
                res[value.productId].quantity += value.quantity;
                return res;
            }, {});
            var i = 1;
            var arr = [];
            var granTotalCostAmount = 0;
            var grandTotalAmount = 0;
            result.forEach(function (r) {
                // var product = Pos.Collection.Products.findOne(r.productId);
                grandTotalAmount += r.amount;
                granTotalCostAmount += r.totalCost;
                // var unit = Pos.Collection.Units.findOne(product.unitId).name;
                arr.push({
                    order: i,
                    productId: r.productId,
                    productName: r._product.name + "(" + r._product._unit.name + ")",
                    // price: numeral(r.price).format('0,0.00'),
                    quantity: r.quantity,
                    total: numeral(r.amount).format('0,0.00'),
                    totalCost: numeral(r.totalCost).format('0,0.00')
                });
                i++;
            });
            var grandTotalAmountFormatted = numeral(grandTotalAmount).format('0,0.00');
            var grandTotalCostAmountFormatted = numeral(granTotalCostAmount).format('0,0.00');
            grandTotal += grandTotalAmount;
            grandTotalCost += granTotalCostAmount;
            customerList.push({
                customerId: customer._id,
                name: customer.name,
                items: arr,
                grandTotalAmount: grandTotalAmountFormatted,
                grandTotalCostAmount: grandTotalCostAmountFormatted
            });
        });
    } else {
        var customer = Pos.Collection.Customers.findOne(params.customerId);
        var saleIds = Pos.Collection.Sales.find(params, {fields: {_id: 1}}).map(function (sale) {
            return sale._id;
        });
        var selectorObj = {};
        selectorObj.saleId = {$in: saleIds};
        if (promotion == 'true') {
            selectorObj.isPromotion = true;
        }
        else if (promotion == 'false') {
            selectorObj.isPromotion = {$ne: true};
        }
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
        var saleDetails = Pos.Collection.SaleDetails.find(
            selectorObj,
            {
                sort: {'_product.name': 1},
                fields: {productId: 1, quantity: 1, price: 1, amount: 1, totalCost: 1, _product: 1}
            });
        (saleDetails.fetch()).reduce(function (res, value) {
            if (!res[value.productId]) {
                res[value.productId] = {
                    totalCost: value.totalCost,
                    amount: value.amount,
                    quantity: 0,
                    productId: value.productId,
                    _product: value._product
                };
                result.push(res[value.productId])
            } else {
                res[value.productId].amount += value.amount;
                res[value.productId].totalCost += value.totalCost;
            }
            res[value.productId].quantity += value.quantity;
            return res;
        }, {});
        var i = 1;
        var arr = [];
        var granTotalCostAmount = 0;
        var grandTotalAmount = 0;
        result.forEach(function (r) {
            // var product = Pos.Collection.Products.findOne(r.productId);
            grandTotalAmount += r.amount;
            granTotalCostAmount += r.totalCost;
            // var unit = Pos.Collection.Units.findOne(product.unitId).name;
            arr.push({
                order: i,
                productId: r.productId,
                productName: r._product.name + "(" + r._product._unit.name + ")",
                // price: numeral(r.price).format('0,0.00'),
                quantity: r.quantity,
                total: numeral(r.amount).format('0,0.00'),
                totalCost: numeral(r.totalCost).format('0,0.00')
            });
            i++;
        });
        var grandTotalAmountFormatted = numeral(grandTotalAmount).format('0,0.00');
        var grandTotalCostAmountFormatted = numeral(granTotalCostAmount).format('0,0.00');
        grandTotal += grandTotalAmount;
        grandTotalCost += granTotalCostAmount;
        customerList.push({
            customerId: customer._id,
            name: customer.name,
            items: arr,
            grandTotalAmount: grandTotalAmountFormatted,
            grandTotalCostAmount: grandTotalCostAmountFormatted
        });
    }
    var grandTotalF = numeral(grandTotal).format('0,0.00');
    var grandTotalCostF = numeral(grandTotalCost).format('0,0.00');
    return {list: customerList, grandTotal: grandTotalF, grandTotalCost: grandTotalCostF};
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


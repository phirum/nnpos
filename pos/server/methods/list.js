Meteor.methods({
    getSaleListForPayment: function (selector) {
        var list = [{
            label: "(Select One)",
            value: ""
        }];
        Pos.Collection.Sales.find(selector).forEach(function (obj) {
            var payment = Pos.Collection.Payments.findOne({
                saleId: obj._id,
                branchId: selector.branchId
                //balanceAmount: {$gt: 0}
            }, {
                sort: {
                    _id: -1,
                    paymentDate: -1
                }
            });
            if (payment == null) {
                list.push({
                    label: obj._id + ' : ' + obj._customer.name,
                    value: obj._id
                });
            } else if (payment.balanceAmount > 0) {
                list.push({
                    label: obj._id + ' : ' + obj._customer.name,
                    value: obj._id
                });
            }
        });
        return list;
    },
    getCustomerList: function (selector) {
        var list = [{label: "(Select One)", value: ""}];
        Pos.Collection.Customers.find(selector).forEach(function (obj) {
            list.push({label: obj._id + ' : ' + obj.name, value: obj._id});
        });
        return list;
    },
    getSupplierList: function (selector) {
        var list = [{label: "(Select One)", value: ""}];
        Pos.Collection.Suppliers.find(selector).forEach(function (obj) {
            list.push({label: obj._id + ' : ' + obj.name, value: obj._id});
        });
        return list;
    },
    getPurchaseList: function (selector) {
        var list = [{label: "(Select One)", value: ""}];
        Pos.Collection.Purchases.find(selector).forEach(function (obj) {
            var payment = Pos.Collection.Payments.findOne({
                    purchaseId: obj._id,
                    branchId: selector.branchId
                    //balanceAmount: {$gt: 0}
                },
                {
                    sort: {_id: -1, paymentDate: -1}
                }
            );
            if (payment == null) {
                list.push({label: obj._id + ' : ' + obj._supplier.name, value: obj._id});
            } else if (payment.balanceAmount > 0) {
                list.push({label: obj._id + ' : ' + obj._supplier.name, value: obj._id});
            }


        });
        return list;
    },
    getProductList: function () {
        var list = [{label: "(Select One)", value: ""}];
        Pos.Collection.Products.find().forEach(function (obj) {
            list.push({label: obj._id + ' : ' + obj.name, value: obj._id});
        });
        return list;
    }
});
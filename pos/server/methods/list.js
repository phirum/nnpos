Meteor.methods({
    getSaleListForPayment: function (selector) {
        var list = [{
            label: "(Select One)",
            value: ""
        }];
        Pos.Collection.Sales.find(selector).forEach(function (obj) {
            obj.date = moment(obj.saleDate).format('DD-MM-YYYY');
            obj.voucher = obj.voucher ? obj.voucher : '';
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
                    label: obj._id + ' | ' + obj._customer.name + ' | ' + obj.date + ' | ' + obj.owedAmount + ' | ' + obj.voucher,
                    value: obj._id
                });
            } else if (payment.balanceAmount > 0) {
                list.push({
                    label: obj._id + ' | ' + obj._customer.name + ' | ' + obj.date + ' | ' + obj.owedAmount + ' | ' + obj.voucher,
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
            obj.date = moment(obj.purchaseDate).format('DD-MM-YYYY');
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
                list.push({
                    label: obj._id + ' | ' + obj._supplier.name + ' | ' + obj.date + ' | ' + obj.owedAmount,
                    value: obj._id
                });
            } else if (payment.balanceAmount > 0) {
                list.push({
                    label: obj._id + ' | ' + obj._supplier.name + ' | ' + obj.date + ' | ' + obj.owedAmount,
                    value: obj._id
                });
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
    },
    getUserStaffList: function (branchId) {
        console.log(branchId);
        var list = [{label: 'Select One', value: ''}];
        var userStaff = Pos.Collection.UserStaffs.findOne({userId: Meteor.userId});
        if (userStaff != null) {
            var staffs = Pos.Collection.Staffs.find({
                _id: {$in: userStaff.staffIds},
                branchId: branchId
            }, {fields: {_id: 1, name: 1}});
            staffs.forEach(function (staff) {
                list.push({label: staff.name, value: staff._id});
            });
        }
        return list;
    }
});
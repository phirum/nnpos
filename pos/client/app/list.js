/**
 * List
 */

var getCategoryIdsForExclusion = function (array, categories) {
    if (categories != null) {
        categories.forEach(function (c) {
            array.push(c._id);
            var cats = Pos.Collection.Categories.find({parentId: c._id});
            if (cats != null) {
                return getCategoryIdsForExclusion(array, cats);
            }
        });
    }
    return array;
};
var pushToList = function (array, obj) {
    var str = "";
    for (var i = 0; i < obj.level * 3; i++) {
        str += "&nbsp;";
    }
    array.push({
        label: Spacebars.SafeString(str + obj.name),
        value: obj._id
    });
    return array;
};

var getCategoryList = function (selector, array, categories, alreadyUse) {
    if (categories != null) {
        categories.forEach(function (c) {
            array = pushToList(array, c);
            /* var str = "";
             for (var i = 0; i < c.level * 3; i++) {
             str += "&nbsp;";
             }
             array.push({
             label: Spacebars.SafeString(str + (c.level + 1) + '. ' + c.name),
             value: c._id
             });*/
            alreadyUse.push(c._id);
            selector.parentId = c._id;
            var cats = Pos.Collection.Categories.find(selector);
            if (cats != null) {
                return getCategoryList(selector, array, cats, alreadyUse);
            }
        });
    }
    return array;
};

Pos.ListForReport={
    locations:function(){
        var list = [{label: "All", value: ""}];
        var branchIdSession = Session.get('branchIds');
        var branchIds = [];
        if (branchIdSession != null) {
            branchIds = branchIdSession;
        } else {
            var userId = Meteor.userId();
            branchIds = Meteor.users.findOne(userId).rolesBranch;
        }
        Pos.Collection.Locations.find({branchId: {$in: branchIds}}).forEach(function (obj) {
            list.push({label: obj._id + ' : ' + obj.name, value: obj._id});
        });
        return list;
    }
};


Pos.List = {
    locations:function(){
        var list = [{label: "(Select One)", value: ""}];
        Pos.Collection.Locations.find({branchId:Session.get('currentBranch')}).forEach(function (obj) {
            list.push({label: obj._id + ' : ' + obj.name, value: obj._id});
        });
        return list;
    },
    gender: function () {
        return [
            {label: "(Select One)", value: ""},
            {label: 'Male', value: 'M'},
            {label: 'Female', value: 'F'}
        ];
    },
    status: function () {
        return [
            {label: "(Select One)", value: ""},
            {label: "Enable", value: "enable"},
            {label: "Disable", value: "disable"}
        ];
    },
    category: function (param) {
        var list = [];
        if (param != false) {
            var label = param != null ? param : "(Select One)";
            list.push({label: label, value: ""});
        }
        var categoryId = Session.get('CategoryIdSession');
        var selector = {};
        if (categoryId != null) {
            var arr = [categoryId];
            var categories = Pos.Collection.Categories.find({parentId: categoryId});
            arr = getCategoryIdsForExclusion(arr, categories);
            selector._id = {$not: {$in: arr}};
        }

        var alreadyUse = [];
        Pos.Collection.Categories.find(selector, {sort: {level: 1}}).forEach(function (obj) {
            if (alreadyUse.indexOf(obj._id) == -1) {
                debugger;
                pushToList(list, obj);
                selector.parentId = obj._id;
                var categories = Pos.Collection.Categories.find(selector);
                list = getCategoryList(selector, list, categories, alreadyUse);
            }
            /*var str = "";
             for (var i = 0; i < obj.level * 3; i++) {
             str += "&nbsp;";
             }
             list.push({
             label: Spacebars.SafeString(str + (obj.level + 1) + '. ' + obj.name),
             value: obj._id
             });*/
        });
        return list;
    },
    subCategory: function () {
        var categoryId = Session.get('CategoryIdSession');
        var list = [{label: "(Select One)", value: ""}];
        if (categoryId == null) {
            Pos.Collection.SubCategories.find().forEach(function (obj) {
                list.push({label: obj._id + ' : ' + obj.name, value: obj._id});
            });
        } else {
            Pos.Collection.SubCategories.find({categoryId: categoryId}).forEach(function (obj) {
                list.push({label: obj._id + ' : ' + obj.name, value: obj._id});
            });
        }
        return list;

    },
    unit: function () {
        var list = [{label: "(Select One)", value: ""}];
        Pos.Collection.Units.find().forEach(function (obj) {
            list.push({label: obj._id + ' : ' + obj.name, value: obj._id});
        });
        return list;
    },
    staff: function () {
        var list = [{label: "All", value: ""}];
        var branchIdSession = Session.get('branchIds');
        var branchIds = [];
        if (branchIdSession != null) {
            branchIds = branchIdSession;
        } else {
            var userId = Meteor.userId();
            branchIds = Meteor.users.findOne(userId).rolesBranch;
        }
        Pos.Collection.Staffs.find({branchId: {$in: branchIds}}).forEach(function (obj) {
            list.push({label: obj._id + ' : ' + obj.name, value: obj._id});
        });
        return list;
    },
    customer: function () {
        var list = [{label: "All", value: ""}];
        var branchIdSession = Session.get('branchIds');
        var branchIds = [];
        if (branchIdSession != null) {
            branchIds = branchIdSession;
        } else {
            var userId = Meteor.userId();
            branchIds = Meteor.users.findOne(userId).rolesBranch;
        }
        Pos.Collection.Customers.find({branchId: {$in: branchIds}}).forEach(function (obj) {
            list.push({label: obj._id + ' : ' + obj.name, value: obj._id});
        });

        return list;
    },
    supplier: function () {
        var list = [{label: "All", value: ""}];
        var branchIdSession = Session.get('branchIds');
        var branchIds = [];
        if (branchIdSession != null) {
            branchIds = branchIdSession;
        } else {
            var userId = Meteor.userId();
            branchIds = Meteor.users.findOne(userId).rolesBranch;
        }
        Pos.Collection.Suppliers.find({branchId: {$in: branchIds}}).forEach(function (obj) {
            list.push({label: obj._id + ' : ' + obj.name, value: obj._id});
        });
        return list;
    },
    productType: function () {
        return [
            {label: "(Select One)", value: ""},
            {label: "Stock", value: "Stock"},
            {label: "Non Stock", value: "NonStock"}
        ];
    },
    branchForUser: function (selectOne, userId) {
        var list = [];
        if (!_.isEqual(selectOne, false)) {
            list.push({label: "All", value: ""});
        }
        var userId = _.isUndefined(userId) ? Meteor.userId() : userId;
        Meteor.users.findOne(userId).rolesBranch
            .forEach(function (branch) {
                var label = Cpanel.Collection.Branch.findOne(branch).enName;
                list.push({label: label, value: branch});
            });
        return list;
    },
    customerList: function () {
        var list = [{label: "(Select One)", value: ""}];
        var branchIdSession = Session.get('currentBranch');
        var selector = {};
        if (branchIdSession != null) selector.branchId = branchIdSession;
        Pos.Collection.Customers.find(selector).forEach(function (obj) {
            list.push({label: obj._id + ' : ' + obj.name, value: obj._id});
        });
        return list;
    },
    supplierList: function () {
        var list = [{label: "(Select One)", value: ""}];
        var branchIdSession = Session.get('currentBranch');
        var selector = {};
        if (branchIdSession != null) selector.branchId = branchIdSession;
        Pos.Collection.Suppliers.find(selector).forEach(function (obj) {
            list.push({label: obj._id + ' : ' + obj.name, value: obj._id});
        });
        return list;
    },
    saleList: function () {
        var list = [{label: "(Select One)", value: ""}];
        var customerSession = Session.get('customerId');
        var branchIdSession = Session.get('currentBranch');
        var selector = {};
        selector.status = "Owed";
        selector.transactionType = "Sale";
        if (branchIdSession != null) selector.branchId = branchIdSession;
        if (customerSession != null) selector.customerId = customerSession;
        Pos.Collection.Sales.find(selector).forEach(function (obj) {
            var payment = Pos.Collection.Payments.findOne({
                    saleId: obj._id,
                    branchId: branchIdSession
                    //balanceAmount: {$gt: 0}
                },
                {
                    sort: {_id: -1, paymentDate: -1}
                }
            );
            if (payment == null) {
                list.push({label: obj._id + ' : ' + obj._customer.name, value: obj._id});
            } else if (payment.balanceAmount > 0) {
                list.push({label: obj._id + ' : ' + obj._customer.name, value: obj._id});
            }

        });
        return list;

    },
    purchaseList: function () {
        var list = [{label: "(Select One)", value: ""}];
        var supplierSession = Session.get('supplierId');
        var branchIdSession = Session.get('currentBranch');
        var selector = {};
        selector.status = "Owed";
        selector.transactionType = "Purchase";
        if (branchIdSession != null) selector.branchId = branchIdSession;
        if (supplierSession != null) selector.supplierId = supplierSession;
        debugger;
        Pos.Collection.Purchases.find(selector).forEach(function (obj) {
            var payment = Pos.Collection.Payments.findOne({
                    purchaseId: obj._id,
                    branchId: branchIdSession
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
    getStaffListByBranchId: function (selectOne) {
        var list = [];
        if (!_.isEqual(selectOne, false)) {
            list.push({label: "(Select One)", value: ""});
        }
        var branchId = Session.get('currentBranch');
        Pos.Collection.Staffs.find({branchId: branchId}).forEach(function (obj) {
            list.push({label: obj._id + ' : ' + obj.name, value: obj._id});
        });
        return list;
    },

    /*    getUserByBranchId: function (selectOne) {
     var list = [];
     if (!_.isEqual(selectOne, false)) {
     list.push({label: "(Select One)", value: ""});
     }
     var branchId = Session.get('currentBranch');
     var userIds=Pos.Collection.UserStaffs.find().map(function(us){
     return us.userId;
     });
     var user = Meteor.users.find({_id:{$not:{$in:userIds}},username:{$ne:'super'}});
     user.forEach(function (u) {
     u.rolesBranch.forEach(function (r) {
     if (r == branchId){
     list.push({label: u.username,value: u._id});
     return false;
     }
     });
     });
     return list;
     }*/

    backupAndRestoreTypes: function () {
        return [
            {value: '', label: 'Select One'},
            {value: 'Setting', label: 'Setting'},
            {value: 'Default', label: 'Default'},
            {value: 'Setting,Default', label: 'Setting And Default'}
        ];
    }

};


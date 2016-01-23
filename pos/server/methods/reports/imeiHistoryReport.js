Meteor.methods({
    posIMEIHistoryReport: function (arg) {
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
        var branchId = arg.branch;
        var imei = arg.imei;
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

        params.branchId = {$in: branchIds};
        params.imei = {"$in": [imei]};
        //params.status = "Owed";
        var saleIMEIHistory = [];
        var purchaseIMEIHistory = [];

        var saleDetails = Pos.Collection.SaleDetails.find(params);
        if (saleDetails.count() > 0) {
            saleIMEIHistory = getSaleIMEIHistory(saleDetails);
        }
        data.saleIMEIHistory = saleIMEIHistory;
        var purchaseDetails = Pos.Collection.PurchaseDetails.find(params);
        if (purchaseDetails.count() > 0) {
            purchaseIMEIHistory = getPurchaseIMEIHistory(purchaseDetails);
        }
        data.purchaseIMEIHistory = purchaseIMEIHistory;

        var header = {};
        var branchNames = "";
        branchIds.forEach(function (id) {
            branchNames += Cpanel.Collection.Branch.findOne(id).enName + ", ";
        });
        header.branch = branchNames.substr(0, branchNames.length - 2);
        header.imei = imei;

        /****** Header *****/
        data.header = header;

        //return reportHelper;
        /****** Content *****/
        return data
    }
});

function getSaleIMEIHistory(saleDetails) {
    var arr = [];
    var i = 1;
    saleDetails.forEach(function (saleDetail) {
        var sale = Pos.Collection.Sales.findOne(saleDetail.saleId);
        saleDetail.saleDate = moment(sale.saleDate).format("DD-MM-YY, HH:mm");
        saleDetail.customer = sale._customer.name;
        saleDetail.staff = sale._staff.name;
        saleDetail.order = i;
        i++;
        arr.push(saleDetail);
    });
    return arr;
}

function getPurchaseIMEIHistory(purchaseDetails) {
    var arr = [];
    var i = 1;
    purchaseDetails.forEach(function (purchaseDetail) {
        var purchase = Pos.Collection.Purchases.findOne(purchaseDetail.purchaseId);
        purchaseDetail.purchaseDate = moment(purchase.purchaseDate).format("DD-MM-YY, HH:mm");
        purchaseDetail.supplier = purchase._supplier.name;
        purchaseDetail.staff = purchase._staff.name;
        purchaseDetail.order = i;
        i++;
        arr.push(purchaseDetail);
    });
    return arr;
}






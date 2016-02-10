Meteor.methods({
    posPurchaseReport: function (arg) {
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
        var supplierId = arg.supplierId;
        var staffId = arg.staffId;
        var branchId = arg.branch;
        var locationId = arg.locationId;
        var branchIds = [];
        if (branchId == "" || branchId == null) {
            // var userId = Meteor.userId();
            var userId = this.userId;
            branchIds = Meteor.users.findOne(userId).rolesBranch;
        } else {
            branchIds.push(branchId);
        }
        data.title = Cpanel.Collection.Company.findOne();
        var staff = "All", supplier = "All", location = "All";
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
        header.location = location;
        header.staff = staff;
        header.supplier = supplier;
        data.header = header;

        var purchase = Pos.Collection.Purchases.find(params);
        var content = calculatePurchaseHelper(purchase);
        data.grandTotalPaid = content.grandTotalPaid;
        data.grandTotalOwed = content.grandTotalOwed;
        data.grandTotal = content.grandTotal;
        data.grandTotalConvert = content.grandTotalConvert;

        if (content.length > 0) {
            data.content = content;
        }
        return data
    }
});

function calculatePurchaseHelper(pur) {
    var grandTotalOwed = 0;
    var grandTotal = 0;
    var grandTotalConvert = {};
    var purchaseList = [];
    var i = 1;
    pur.forEach(function (p) {
        grandTotal += p.total;
        p.order = i;
        p.exchangeRates = [];
        Pos.Collection.ExchangeRates.findOne(p.exchangeRateId).rates.forEach(function (ex) {
            ex.exTotal = p.total * ex.rate;
            if (grandTotalConvert[ex.toCurrencyId] == null) {
                grandTotalConvert[ex.toCurrencyId] = 0
            }
            grandTotalConvert[ex.toCurrencyId] += ex.exTotal;
            ex.exTotal=numeral(ex.exTotal).format('0,0.00');
            p.exchangeRates.push(ex);
        });
        p.purchaseDate = moment(p.purchaseDate).format("DD-MM-YY, HH:mm");
        p.owedAmount = p.owedAmount ? p.owedAmount : 0;
        p.paidAmount = p.total - p.owedAmount;
        grandTotalOwed += p.owedAmount;
        p.paidAmount = numeral(p.paidAmount).format('0,0.00');
        p.owedAmount = numeral(p.owedAmount).format('0,0.00');
        p.total = numeral(p.total).format('0,0.00');
        p.supplier = p._supplier.name;
        p.staff = p._staff.name;
        // p.supplier = Pos.Collection.Suppliers.findOne(p.supplierId).name;
        // p.staff = Pos.Collection.Staffs.findOne(p.staffId).name;
        i++;
        purchaseList.push(p);
    });
    purchaseList.grandTotalPaid = numeral(grandTotal-grandTotalOwed).format('0,0.00');
    purchaseList.grandTotalOwed = numeral(grandTotalOwed).format('0,0.00');
    purchaseList.grandTotal = numeral(grandTotal).format('0,0.00');
    purchaseList.grandTotalConvert = [];
    for (var key in grandTotalConvert) {
        purchaseList.grandTotalConvert.push({
            toCurrencyId: key,
            totalConvert: numeral(grandTotalConvert[key]).format('0,0.00')
        });
    }

    return purchaseList;
}

Session.set('branchIds', null);
Template.pos_purchaseReport.onRendered(function () {
    var name = $('[name="date"]');
    DateTimePicker.dateRange(name);
});
Template.pos_purchaseReport.events({
    'change select[name="branch"]': function (e) {
        var branchId = $(e.currentTarget).val();
        if (branchId == "") {
            var userId = Meteor.userId();
            var branchIds = Meteor.users.findOne(userId).rolesBranch;
            Session.set('branchIds', branchIds);
        } else {
            var branchIds = [];
            branchIds.push(branchId);
            Session.set('branchIds', branchIds);
        }
    }
});


Template.pos_purchaseReportGen.helpers({
    getGrandTotalConvert:function(obj,key){
        return obj[key];
    },
    multiply: function (val1, val2, id) {
        var value = (val1 * val2);
        if (id != null && id == "KHR") {
            value = roundRielCurrency(value);
            return numeral(value).format('0,0.00');
        }
        return numeral(value).format('0,0.00');
    },
    options: function () {
        // font size = null (default), bg
        // paper = a4, a5, mini
        // orientation = portrait, landscape
        return {
            //fontSize: 'bg',
            paper: 'a4',
            orientation: 'portrait'
        };
    },
    data: function () {
        // Get query params
        //FlowRouter.watchPathChange();
        var q = FlowRouter.current().queryParams;

        var callId = JSON.stringify(q);
        var call = Meteor.callAsync(callId, 'posPurchaseReport', q);
        if (!call.ready()) {
            return false;
        }
        return call.result();
    }

});

/*

Template.pos_purchaseReportGen.helpers({
    getGrandTotalConvert: function (obj, key) {
        return obj[key];
    },
    multiply: function (val1, val2, id) {
        var value = (val1 * val2);
        if (id != null && id == "KHR") {
            value = roundRielCurrency(value);
            return numeral(value).format('0,0.00');
        }
        return numeral(value).format('0,0.00');
    },
    reportHelper: function () {
        var params = {};
        var date = this.date.split(" To ");
        var fromDate = moment(date[0] + " 00:00:00").toDate();
        var toDate = moment(date[1] + " 23:59:59").toDate();
        var supplierId = this.supplierId;
        var staffId = this.staffId;
        var branchId = this.branch;
        var branchIds = [];
        if (branchId == "" || branchId == null) {
            var userId = Meteor.userId();
            branchIds = Meteor.users.findOne(userId).rolesBranch;
        } else {
            branchIds.push(branchId);
        }
        if (fromDate != null && toDate != null) params.purchaseDate = {$gte: fromDate, $lte: toDate};
        if (supplierId != null && supplierId != "") params.supplierId = supplierId;
        if (staffId != null && staffId != "") params.staffId = staffId;
        params.branchId = {$in: branchIds};
        params.status = "Paid";
        var purchase = Pos.Collection.Purchases.find(params);

        var reportHelper = {};
        reportHelper.companyName = Cpanel.Collection.Company.findOne().enName;
        var branchNames = "";
        branchIds.forEach(function (id) {
            branchNames += Cpanel.Collection.Branch.findOne(id).enName + ", ";
        });

        reportHelper.branch = branchNames.substr(0, branchNames.length - 2);
        reportHelper.reportName = 'Purchase Report';
        reportHelper.date = this.date;

        var staff = "All", supplier = "All";
        if (supplierId != null && supplierId != "")
            supplier = Pos.Collection.Suppliers.findOne(supplierId).name;
        if (staffId != null && staffId != "")
            staff = Pos.Collection.Staffs.findOne(staffId).name;
        reportHelper.header = [
            {col1: 'Staff: ' + staff, col2: 'Supplier: ' + supplier, col3: ''}
        ];
        reportHelper.purchase = calculatePurchaseHelper(purchase);
        reportHelper.footer = 'footer';
        return reportHelper;
    }
});

function calculatePurchaseHelper(pur) {
    var grandTotal = 0;
    var grandTotalConvert = {};
    var purchaseList = [];
    var i = 1;
    pur.forEach(function (p) {
        grandTotal += p.total;
        p.purchaseDate = moment(p.purchaseDate).format("DD-MM-YY, HH:mm");
        p.total = numeral(p.total).format('0,0.00');
        p.supplier = Pos.Collection.Suppliers.findOne(p.supplierId).name;
        p.staff = Pos.Collection.Staffs.findOne(p.staffId).name;
        p.order = i;
        p.exchangeRates = [];
        Pos.Collection.ExchangeRates.findOne(p.exchangeRateId).rates.
            forEach(function (ex) {
                ex.exTotal = p.total * ex.rate;
                if (grandTotalConvert[ex.toCurrencyId] == null) {
                    grandTotalConvert[ex.toCurrencyId] = 0
                }
                grandTotalConvert[ex.toCurrencyId] += ex.exTotal;
                p.exchangeRates.push(ex);

            });
        i++;
        purchaseList.push(p);
    });
    purchaseList.grandTotal = numeral(grandTotal).format('0,0.00');
    purchaseList.grandTotalConvert = [];
    $.each(grandTotalConvert, function (key, value) {
        purchaseList.grandTotalConvert.push({toCurrencyId: key, totalConvert: value});
    });
    return purchaseList;
}


*/

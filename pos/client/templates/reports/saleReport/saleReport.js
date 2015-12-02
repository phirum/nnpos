Session.set('branchIds', null);
Template.pos_saleReport.onRendered(function () {
    var name = $('[name="date"]');
    DateTimePicker.dateRange(name);
});
Template.pos_saleReport.events({
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

Template.pos_saleReportGen.helpers({
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
        var call = Meteor.callAsync(callId, 'posSaleReport', q);
        if (!call.ready()) {
            return false;
        }
        return call.result();
    }
});


/* reportHelper: function () {
 var params = {};
 var date = this.date.split(" To ");
 var fromDate = moment(date[0] + " 00:00:00").toDate();
 var toDate = moment(date[1] + " 23:59:59").toDate();
 var customerId = this.customerId;
 var staffId = this.staffId;
 var branchId = this.branch;
 var branchIds = [];
 if (branchId == "" || branchId == null) {
 var userId = Meteor.userId();
 branchIds = Meteor.users.findOne(userId).rolesBranch;
 } else {
 branchIds.push(branchId);
 }
 if (fromDate != null && toDate != null) params.saleDate = {$gte: fromDate, $lte: toDate};
 if (customerId != null && customerId != "") params.customerId = customerId;
 if (staffId != null && staffId != "") params.staffId = staffId;
 params.branchId = {$in: branchIds};
 params.status = "Paid";
 var sale = Pos.Collection.Sales.find(params);
 debugger;
 var reportHelper = {};
 reportHelper.companyName = Cpanel.Collection.Company.findOne().enName;
 var branchNames = "";
 branchIds.forEach(function (id) {
 branchNames += Cpanel.Collection.Branch.findOne(id).enName + ", ";
 });

 reportHelper.branch = branchNames.substr(0, branchNames.length - 2);
 reportHelper.reportName = 'Sale Report';
 reportHelper.date = this.date;

 var staff = "All", customer = "All";
 if (customerId != null && customerId != "")
 customer = Pos.Collection.Customers.findOne(customerId).name;
 if (staffId != null && staffId != "")
 staff = Pos.Collection.Staffs.findOne(staffId).name;
 reportHelper.header = [
 {col1: 'Staff: ' + staff, col2: 'Customer: ' + customer, col3: ''}
 ];
 reportHelper.sale = calculateSaleHelper(sale);
 reportHelper.footer = 'footer';
 return reportHelper;
 }*/

/*

function calculateSaleHelper(sl) {
    var grandTotal = 0;
    var grandTotalConvert = {};
    var saleList = [];
    var i = 1;
    sl.forEach(function (s) {
        grandTotal += s.total;
        s.saleDate = moment(s.saleDate).format("DD-MM-YY, HH:mm");
        s.total = numeral(s.total).format('0,0.00');
        s.customer = Pos.Collection.Customers.findOne(s.customerId).name;
        s.staff = Pos.Collection.Staffs.findOne(s.staffId).name;
        s.order = i;
        s.exchangeRates = [];
        Pos.Collection.ExchangeRates.findOne(s.exchangeRateId).rates.
            forEach(function (ex) {
                ex.exTotal = s.total * ex.rate;
                if(grandTotalConvert[ex.toCurrencyId]==null){grandTotalConvert[ex.toCurrencyId]=0}
                grandTotalConvert[ex.toCurrencyId]+= ex.exTotal;
                s.exchangeRates.push(ex);

            });
        i++;
        saleList.push(s);
    });
    saleList.grandTotal = numeral(grandTotal).format('0,0.00');
    saleList.grandTotalConvert=[];
    $.each(grandTotalConvert,function(key,value){
        saleList.grandTotalConvert.push({toCurrencyId:key,totalConvert:value});
    });
    return saleList;
}
*/



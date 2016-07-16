Session.set('branchIds', null);
Template.pos_stockReport.onRendered(function () {
    var name = $('[name="date"]');
    DateTimePicker.date(name);

});
Template.pos_stockReport.helpers({
    categoryList: function () {
        var categories;
        var list = [];
        categories = ReactiveMethod.call('categoryList', 'All', null);
        categories.forEach(function (category) {
            list.push({
                label: Spacebars.SafeString(category.label),
                value: category.value
            });
        });
        return list;
    }
});
Template.pos_stockReport.events({
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

Template.pos_stockReportGen.helpers({
    /*reportHelper: function () {
     var params = {};
     // var date=new Date(this.date);
     var date = moment(this.date + " 23:59:59").toDate();
     var branchId = this.branch;
     if (date != null) params.createdAt = {$lte: date};
     if (branchId != null && branchId != null) params.branchId = branchId;

     var reportHelper = {};
     reportHelper.companyName = Cpanel.Collection.Company.findOne().enName;
     var branchNames = "";

     reportHelper.branch = Cpanel.Collection.Branch.findOne(branchId).enName;
     reportHelper.reportName = 'Stock Balance Report';
     reportHelper.date = this.date;

     reportHelper.header = [
     {col1: "", col2: '', col3: ''}
     ];

     var stockArray = [];
     var i = 1;
     var stockHistories = Pos.Collection.StockHistories.findOne(params, {sort: {createdAt: -1}});
     if (stockHistories != null) {
     var branchName = Cpanel.Collection.Branch.findOne(stockHistories.branchId).enName;
     stockHistories.stockList.forEach(function (stockObj) {
     var product = Pos.Collection.Products.findOne(stockObj.productId);
     stockObj.order = i;
     i++;
     stockObj.productName = product.name;
     stockObj.barcode = product.barcode;
     stockObj.purchasePrice = product.purchasePrice;
     stockObj.branchName = branchName;
     stockArray.push(stockObj);
     });
     }
     reportHelper.stock = stockArray;
     return reportHelper;
     },*/
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
        var call = Meteor.callAsync(callId, 'posStockReport', q);

        if (!call.ready()) {
            return false;
        }

        return call.result();
    }
});

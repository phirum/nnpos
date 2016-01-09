Meteor.methods({
    getPurchaseInvoiceData: function (purchaseId) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        var data = {};
        var currencyId = Cpanel.Collection.Setting.findOne().baseCurrency;
        data.baseCurrency = Cpanel.Collection.Currency.findOne(currencyId);
        data.company = Cpanel.Collection.Company.findOne();
        data.purchase = getPurchase(purchaseId);
        data.purchaseDetails = getPurchaseDetail(purchaseId);
        data.paymentObj = Pos.Collection.PurchasePayments.findOne({purchaseId: purchaseId}, {sort: {_id: 1}});
        data.hasPayment = data.paymentObj != null;
        return data;
    }
});

function getPurchase(purchaseId) {
    var s = Pos.Collection.Purchases.findOne(purchaseId);
    s.purchaseDate = moment(s.purchaseDate).format("DD-MM-YYYY, HH:mm");
    s.subTotalFormatted = numeral(s.subTotal).format('0,0.00');
    s.totalFormatted = numeral(s.total).format('0,0.00');
    return s;
}
function getPurchaseDetail(purchaseId) {
    var purchaseDetailItems = [];
    var purchaseDetails = Pos.Collection.PurchaseDetails.find({purchaseId: purchaseId});
    var i = 1;
    purchaseDetails.forEach(function (pd) {
        // var item = _.extend(pd,{});
        /*var product = Pos.Collection.Products.findOne(pd.productId);
         var unit = Pos.Collection.Units.findOne(product.unitId).name;
         pd.productName = product.name + "(" + unit + ")";*/
        pd.amountFormated = numeral(pd.amount).format('0,0.00');
        // pd.order = pad(i, 2);
        pd.order = i;
        // pd.qtyPrint = pd.quantity - pd.qtyPrinted;
        i++;
        purchaseDetailItems.push(pd);
    });
    return purchaseDetailItems;
}



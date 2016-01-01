Meteor.methods({
    getSaleInvoiceData: function (saleId) {
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        var data = {};
        var currencyId = Cpanel.Collection.Setting.findOne().baseCurrency;
        data.baseCurrency = Cpanel.Collection.Currency.findOne(currencyId);
        data.company = Cpanel.Collection.Company.findOne();
        data.sale = getSale(saleId);
        data.saleDetails = getSaleDetail(saleId);
        data.paymentObj = Pos.Collection.Payments.findOne({saleId: saleId}, {sort: {_id: 1}});
        data.hasPayment = data.paymentObj != null;
        return data;
    }
});

function getSale(saleId) {
    var s = Pos.Collection.Sales.findOne(saleId);
    s.saleDate = moment(s.saleDate).format("DD-MM-YYYY, HH:mm");
    s.subTotalFormatted = numeral(s.subTotal).format('0,0.00');
    s.totalFormatted = numeral(s.total).format('0,0.00');
    s.InvoiceType= s.isRetail?'Retail':'Wholesale';
    return s;
}
function getSaleDetail(saleId) {
    var saleDetailItems = [];
    var saleDetails = Pos.Collection.SaleDetails.find({saleId: saleId});
    var i = 1;
    saleDetails.forEach(function (sd) {
        // var item = _.extend(sd,{});
        /*var product = Pos.Collection.Products.findOne(sd.productId);
         var unit = Pos.Collection.Units.findOne(product.unitId).name;
         sd.productName = product.name + "(" + unit + ")";*/

        sd.amountFormated = numeral(sd.amount).format('0,0.00');
        // sd.order = pad(i, 2);
        sd.order = i;
        // sd.qtyPrint = sd.quantity - sd.qtyPrinted;
        i++;
        saleDetailItems.push(sd);
    });
    return saleDetailItems;
}
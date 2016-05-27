Meteor.methods({
    getSaleInvoiceData: function (saleId) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        var data = {};
        var currencyId = Cpanel.Collection.Setting.findOne().baseCurrency;
        data.baseCurrency = Cpanel.Collection.Currency.findOne(currencyId);
        data.company = Cpanel.Collection.Company.findOne();
        data.sale = getSale(saleId, data.baseCurrency);
        data.saleDetails = getSaleDetail(saleId, data.baseCurrency);
        data.promotionSaleDetails = getPromotionSaleDetail(saleId, data.baseCurrency);
        data.paymentObj = Pos.Collection.Payments.findOne({saleId: saleId}, {sort: {_id: 1}});
        data.hasPayment = data.paymentObj != null;
        return data;
    }
});

function getSale(saleId, baseCurrency) {
    var s = Pos.Collection.Sales.findOne(saleId);
    if (s._exchangeRate) {
        s._exchangeRate.rates.forEach(function (ex) {
            if (ex.toCurrencyId == "KHR") {
                ex.totalFormatted = numeral(roundRielCurrency(ex.rate * s.total)).format('0,0');
            } else {
                ex.totalFormatted = numeral(ex.rate * s.total).format('0,0.00');
            }
        });
    }
    s.saleDate = moment(s.saleDate).format("DD-MM-YYYY, HH:mm");
    s.subTotalFormatted = numeral(s.subTotal).format('0,0.00');
    s.totalFormatted = numeral(s.total).format('0,0.00');
    s.InvoiceType = s.isRetail ? 'Retail' : 'Wholesale';
    return s;
}
function getSaleDetail(saleId, baseCurrency) {
    var saleDetailItems = [];
    var saleDetails = Pos.Collection.SaleDetails.find({saleId: saleId, isPromotion: {$ne: true}});
    var i = 1;
    saleDetails.forEach(function (sd) {
        sd.amountFormated = numeral(sd.amount).format('0,0.00') + baseCurrency.symbol;
        sd.order = i;
        i++;
        saleDetailItems.push(sd);
    });
    return saleDetailItems;
}
function getPromotionSaleDetail(saleId, baseCurrency) {
    var saleDetailItems = [];
    var saleDetails = Pos.Collection.SaleDetails.find({saleId: saleId, isPromotion: true});
    var i = 1;
    saleDetails.forEach(function (sd) {
        sd.amountFormated = numeral(sd.amount).format('0,0.00') + baseCurrency.symbol;
        sd.order = i;
        i++;
        saleDetailItems.push(sd);
    });
    return saleDetailItems;
}
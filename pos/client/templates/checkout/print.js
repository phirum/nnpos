/*

 Template.pos_printCheckout.helpers({
 getFieldOfCurrency: function (id, field) {
 var currency = Cpanel.Collection.Currency.findOne(id);
 return currency[field];
 },
 multiply: function (val1, val2, id) {
 var value = (val1 * val2);
 if (id != null && id == "KHR") {
 value = roundRielCurrency(value);
 return numeral(value).format('0,0.00');
 }
 return numeral(value).format('0,0.00');
 },
 baseCurrency: function () {
 var id = Cpanel.Collection.Setting.findOne().baseCurrency;
 return Cpanel.Collection.Currency.findOne(id);
 },
 exchangeRates: function () {
 var sale = Pos.Collection.Sales.findOne(FlowRouter.getParam('saleId'));
 if (sale != null) {
 return Pos.Collection.ExchangeRates.findOne(sale.exchangeRateId);
 } else {
 var id = Cpanel.Collection.Setting.findOne().baseCurrency;
 return Pos.Collection.ExchangeRates.findOne({
 base: id,
 branchId: Session.get('currentBranch')
 }, {sort: {_id: -1, createdAt: -1}});
 }
 },
 company: function () {
 return Cpanel.Collection.Company.findOne({}, {sort: {_id: -1}});

 },
 sale: function () {
 var s = Pos.Collection.Sales.findOne(FlowRouter.getParam('saleId'));
 s.saleDate = moment(s.saleDate).format("DD-MM-YYYY, HH:mm");
 s.subTotalFormatted = numeral(s.subTotal).format('0,0.00');
 s.totalFormatted = numeral(s.total).format('0,0.00');
 s.staff = Pos.Collection.Staffs.findOne(s.staffId).name;
 s.customer = Pos.Collection.Customers.findOne(s.customerId).name;
 return s;

 },
 saleDetails: function () {
 var saleDetailItems = [];
 var saleDetails = Pos.Collection.SaleDetails.find({saleId: FlowRouter.getParam('saleId')});
 var i = 1;
 saleDetails.forEach(function (sd) {
 // var item = _.extend(sd,{});
 /!*var product = Pos.Collection.Products.findOne(sd.productId);
 var unit = Pos.Collection.Units.findOne(product.unitId).name;
 sd.productName = product.name + "(" + unit + ")";*!/

 sd.amountFormated = numeral(sd.amount).format('0,0.00');
 // sd.order = pad(i, 2);
 sd.order = i;
 // sd.qtyPrint = sd.quantity - sd.qtyPrinted;
 i++;
 saleDetailItems.push(sd);
 });
 return saleDetailItems;
 },
 paymentObj: function () {
 return Pos.Collection.Payments.findOne({saleId: FlowRouter.getParam('saleId')},{sort:{_id:1}});
 },
 formatFixTwo: function (val) {
 return numeral(val).format('0,0.00');
 },
 hasPayment: function () {
 var p = Pos.Collection.Payments.findOne({saleId: FlowRouter.getParam('saleId')},{sort:{_id:1}});
 return p != null;
 }
 });
 */

Template.pos_printCheckout.onRendered(
    /*function () {
     setTimeout(function () {
     window.print();
     window.close();
     }, 900);
     }*/
);
Template.pos_printCheckout.helpers({
    getFieldOfCurrency: function (id, field) {
        var currency = Cpanel.Collection.Currency.findOne(id);
        return currency[field];
    },
    multiply: function (val1, val2, id) {
        var value = (val1 * val2);
        if (id != null && id == "KHR") {
            value = roundRielCurrency(value);
            return numeral(value).format('0,0.00');
        }
        return numeral(value).format('0,0.00');
    },
    formatFixTwo: function (val) {
        return numeral(val).format('0,0.00');
    },
    data: function () {
        var saleId=FlowRouter.getParam('saleId');
        var callId = 'saleInvoice'+saleId;
        var call = Meteor.callAsync(callId, 'getSaleInvoiceData', saleId);
        if (!call.ready()) {
            return false;
        }
        return call.result();
    }

});


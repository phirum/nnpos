Meteor.methods({
    posPurchasePaymentHistoryReport: function (arg) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        var data = {
            title: {},
            header: {},
            content: [{index: 'No Result'}],
            footer: {}
        };

        var params = {purchaseId: arg.purchaseId};
        /****** Title *****/
        data.title = Cpanel.Collection.Company.findOne();
        var header = {};
        header.purchaseId = arg.purchaseId;
        data.header = header;
        data.purchase = Pos.Collection.Purchases.findOne(arg.purchaseId);
        var payments = Pos.Collection.PurchasePayments.find(params);
        var content = [];
        var i = 1;
        if (payments.count() > 0) {
            payments.forEach(function (payment) {
                payment.order = i;
                payment.paymentDate = moment(payment.paymentDate).format('DD-MM-YY HH:mm');
                payment.dueAmount = numeral(payment.dueAmount).format('0,0.00');
                payment.balanceAmount = numeral(payment.balanceAmount).format('0,0.00');
                payment.dueAmount = numeral(payment.dueAmount).format('0,0.00');
                i++;
                content.push(payment);
            });
        }
        if (content.length > 0) {
            data.content = content;
        }
        return data
    }
});






Template.pos_printLocationTransfer.helpers({
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
        var locationTransferId=FlowRouter.getParam('locationTransferId');
        var callId = 'locationTransferInvoice'+locationTransferId;
        var call = Meteor.callAsync(callId, 'getLocationTransferInvoiceData', locationTransferId);
        if (!call.ready()) {
            return false;
        }
        return call.result();
    }

});


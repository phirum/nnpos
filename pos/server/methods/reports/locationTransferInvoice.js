Meteor.methods({
    getLocationTransferInvoiceData: function (locationTransferId) {
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        var data = {};
        var currencyId = Cpanel.Collection.Setting.findOne().baseCurrency;
        data.baseCurrency = Cpanel.Collection.Currency.findOne(currencyId);
        data.company = Cpanel.Collection.Company.findOne();
        data.locationTransfer = getLocationTransfer(locationTransferId);
        data.locationTransferDetails = getLocationTransferDetail(locationTransferId);
        return data;
    }
});
function getLocationTransfer(locationTransferId) {
    if (! Meteor.userId()) {
        throw new Meteor.Error("not-authorized");
    }
    var s = Pos.Collection.LocationTransfers.findOne(locationTransferId);
    s.locationTransferDate = moment(s.locationTransferDate).format("DD-MM-YYYY, HH:mm");
    return s;
}
function getLocationTransferDetail(locationTransferId) {
    var locationTransferDetailItems = [];
    var locationTransferDetails = Pos.Collection.LocationTransferDetails.find({locationTransferId: locationTransferId});
    var i = 1;
    locationTransferDetails.forEach(function (sd) {
        sd.order = i;
        i++;
        locationTransferDetailItems.push(sd);
    });
    return locationTransferDetailItems;
}
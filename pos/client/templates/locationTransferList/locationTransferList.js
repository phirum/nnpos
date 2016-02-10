var posLocationTransferListTPL = Template.pos_locationTransferList;
var posLocationTransferShow = Template.pos_locationTransferShow;

posLocationTransferListTPL.onRendered(function () {
    Session.set('locationTransferSelectorSession', null);
    DateTimePicker.dateRange($('#location-transfer-date-filter'));
    createNewAlertify(['locationTransferShow']);
});
posLocationTransferListTPL.helpers({
    selector: function () {
        var selectorSession = Session.get('locationTransferSelectorSession');
        if (selectorSession) {
            return selectorSession;
        } else {
            var selector = {branchId: Session.get('currentBranch')};
            var today = moment().format('YYYY-MM-DD');
            var fromDate = moment(today + " 00:00:00", "YYYY-MM-DD HH:mm:ss").toDate();
            var toDate = moment(today + " 23:59:59", "YYYY-MM-DD HH:mm:ss").toDate();
            selector.locationTransferDate = {$gte: fromDate, $lte: toDate};
            return selector;
        }
    }
});
posLocationTransferListTPL.events({
    'change #location-transfer-date-filter': function () {
        setLocationTransferSelectorSession();
    },
    'change #location-transfer-status-filter': function () {
        setLocationTransferSelectorSession();
    },
    'click .insert': function (e, t) {
        FlowRouter.go('pos.locationTransfer');
    },
    'click .update': function (e, t) {
        FlowRouter.go('pos.locationTransfer', {locationTransferId: this._id});
    },
    'click .remove': function (e, t) {
        var id = this._id;
        alertify.confirm("Are you sure to delete [" + id + "]?")
            .set({
                onok: function (closeEvent) {
                    Pos.Collection.LocationTransfers.remove(id, function (err) {
                        if (err) {
                            alertify.error(err.message);
                        } else {
                            alertify.success("Success");
                        }
                    });
                },
                title: '<i class="fa fa-remove"></i> Delete LocationTransfer'
            });

    },
    'click .show': function (e, t) {
        //var locationTransfer=Pos.Collection.LocationTransfers.findOne(this._id);
        var self = this;
        self.sDate = moment(this.locationTransferDate).format("YYYY-MM-DD HH:mm:ss");
        //self.locationTransferDetails = Pos.Collection.LocationTransferDetails.find({locationTransferId: this._id});
        self.retail = this.isRetail ? "Retail" : "WholelocationTransfer";
        Meteor.call('findRecords', 'Pos.Collection.LocationTransferDetails', {locationTransferId: this._id}, {},
            function (error, locationTransferDetails) {
                if (locationTransferDetails) {
                    self.locationTransferDetails = locationTransferDetails;
                    alertify.locationTransferShow(fa('eye', 'LocationTransfer Detail'), renderTemplate(posLocationTransferShow, self));
                } else {
                    alertify.error(error.message);
                }
            });
    }
});



function setLocationTransferSelectorSession() {
    var selector = {branchId: Session.get('currentBranch')};
    var dateRange = $('#location-transfer-date-filter').val();
    var status = $('#location-transfer-status-filter').val();
    if (dateRange != "") {
        var date = dateRange.split(" To ");
        var fromDate = moment(date[0] + " 00:00:00", "YYYY-MM-DD HH:mm:ss").toDate();
        var toDate = moment(date[1] + " 23:59:59", "YYYY-MM-DD HH:mm:ss").toDate();
        selector.locationTransferDate = {$gte: fromDate, $lte: toDate};
    } else {
        var today = moment().format('YYYY-MM-DD');
        var fromDate = moment(today + " 00:00:00", "YYYY-MM-DD HH:mm:ss").toDate();
        var toDate = moment(today + " 23:59:59", "YYYY-MM-DD HH:mm:ss").toDate();
        selector.locationTransferDate = {$gte: fromDate, $lte: toDate};
    }
    if (status != "") {
        selector.status = status
    }
    Session.set('locationTransferSelectorSession', selector);
}
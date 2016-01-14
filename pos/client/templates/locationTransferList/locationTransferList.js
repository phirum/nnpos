var posLocationTransferListTPL = Template.pos_locationTransferList;
var posLocationTransferShow = Template.pos_locationTransferShow;

posLocationTransferListTPL.onRendered(function () {
    createNewAlertify(['locationTransferShow']);
});
posLocationTransferListTPL.helpers({
    selector: function () {
        return {branchId: Session.get('currentBranch')}
    }
});
posLocationTransferListTPL.events({
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

Meteor.methods({
    //LocationTransfer
    insertLocationTransferAndLocationTransferDetail: function (locationTransfer, locationTransferDetail) {
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        var todayDate = moment().format('YYYYMMDD');
        var prefix = locationTransfer.branchId + "-" + todayDate;
        var locationTransferId= idGenerator.genWithPrefix(Pos.Collection.LocationTransfers, prefix, 4);
        locationTransfer._id=locationTransferId;
        Pos.Collection.LocationTransfers.insert(locationTransfer);
        locationTransferDetail.locationTransferId = locationTransferId;
        Pos.Collection.LocationTransferDetails.insert(locationTransferDetail);
        return locationTransferId;
    },
    insertLocationTransfer: function (obj) {
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        return Pos.Collection.LocationTransfers.insert(obj);
    },
    directInsertLocationTransfer:function(obj){
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        return Pos.Collection.LocationTransfers.direct.insert(obj);
    },
    directUpdateLocationTransfer:function(id,set){
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        Pos.Collection.LocationTransfers.direct.update(id,{$set:set});
    },
    updateLocationTransfer: function (id, set) {
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        Pos.Collection.LocationTransfers.update(id, {$set: set});
    },
    directInsertLocationTransferDetails:function(obj){
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        Pos.Collection.LocationTransferDetails.direct.insert(obj);
    },
    insertLocationTransferDetails: function (obj) {
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        Pos.Collection.LocationTransferDetails.insert(obj);
    },
    directUpdateLocationTransferDetails:function(id,set){
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        Pos.Collection.LocationTransferDetails.direct.update(id,{$set:set});
    },
    updateLocationTransferDetails: function (id, set) {
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        Pos.Collection.LocationTransferDetails.update(id, {$set: set});
    },
    cancelLocationTransfer: function (locationTransferId) {
        //Pos.Collection.LocationTransferDetails.remove({locationTransferId: locationTransferId});
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        Pos.Collection.LocationTransfers.remove(locationTransferId);
    }

});
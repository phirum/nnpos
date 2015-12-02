Meteor.methods({
    //LocationTransfer
    insertLocationTransferAndLocationTransferDetail: function (locationTransfer, locationTransferDetail) {
        var todayDate = moment().format('YYYYMMDD');
        console.log(todayDate);
        var prefix = locationTransfer.branchId + "-" + todayDate;
        var locationTransferId= idGenerator.genWithPrefix(Pos.Collection.LocationTransfers, prefix, 4);
        locationTransfer._id=locationTransferId;
        Pos.Collection.LocationTransfers.insert(locationTransfer);
        locationTransferDetail.locationTransferId = locationTransferId;
        Pos.Collection.LocationTransferDetails.insert(locationTransferDetail);
        return locationTransferId;
    },
    insertLocationTransfer: function (obj) {
        return Pos.Collection.LocationTransfers.insert(obj);
    },
    directInsertLocationTransfer:function(obj){
        return Pos.Collection.LocationTransfers.direct.insert(obj);
    },
    directUpdateLocationTransfer:function(id,set){
        Pos.Collection.LocationTransfers.direct.update(id,{$set:set});
    },
    updateLocationTransfer: function (id, set) {
        Pos.Collection.LocationTransfers.update(id, {$set: set});
    },
    directInsertLocationTransferDetails:function(obj){
        Pos.Collection.LocationTransferDetails.direct.insert(obj);
    },
    insertLocationTransferDetails: function (obj) {
        Pos.Collection.LocationTransferDetails.insert(obj);
    },
    directUpdateLocationTransferDetails:function(id,set){
        Pos.Collection.LocationTransferDetails.direct.update(id,{$set:set});
    },
    updateLocationTransferDetails: function (id, set) {
        Pos.Collection.LocationTransferDetails.update(id, {$set: set});
    },
    cancelLocationTransfer: function (locationTransferId) {
        //Pos.Collection.LocationTransferDetails.remove({locationTransferId: locationTransferId});
        Pos.Collection.LocationTransfers.remove(locationTransferId);
    }

});
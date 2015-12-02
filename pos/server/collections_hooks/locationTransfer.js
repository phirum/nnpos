Pos.Collection.LocationTransferDetails.before.insert(function (user, doc) {
    doc._id = idGenerator.genWithPrefix(Pos.Collection.LocationTransferDetails, doc.locationTransferId, 3);
});
Pos.Collection.LocationTransfers.before.update(function (userId, doc, fieldNames, modifier, options) {
    Meteor.defer(function () {
        if (modifier.$set.toLocationId != null && modifier.$set.toLocationId != doc.toLocationId) {
            Pos.Collection.LocationTransferDetails.update(
                {locationTransferId: doc._id},
                {$set: {toLocationId: modifier.$set.toLocationId}},
                {multi: true});
        }
    });
});
Pos.Collection.LocationTransfers.after.remove(function (userId, doc) {
    Pos.Collection.LocationTransferDetails.remove({locationTransferId: doc._id});
    //Pos.Collection.SaleDetails.direct.remove({saleId: doc._id});
});

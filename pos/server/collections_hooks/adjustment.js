Pos.Collection.Adjustments.after.remove(function(userId,doc){
    Pos.Collection.AdjustmentDetails.direct.remove({adjustmentId: doc._id});
});
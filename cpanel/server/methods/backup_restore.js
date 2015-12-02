Meteor.methods({
    removeCollectionsBeforeRestore: function (collections, query) {
        _.each(collections, function (col) {
            Mongo.Collection.get(col).direct.remove(query, function (error) {
                if (error) {
                    console.log('Error remove collection before restore: ' + col + ' [' + error + ']');
                    return false;
                }
            });
        });

        console.log('Remove collections before restore is success');
        return true;
    }
});

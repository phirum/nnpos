Meteor.methods({
    isRelationExist: function (arr) {
        //var objects = [
        //    {collection: App.Collection.Test, selector: {_id: "001"}},
        //    {collection: App.Collection.Test2, selector: {_id: "002"}}
        //];
        var getArray = _.isArray(arr) ? arr : [];
        var exist = false;
        /*for (var i = 0; i < getObjects.length - 1; i++) {
         var collection = eval(getObjects[i].collection);
         var getRelation = collection.findOne(getObjects[i].selector);
         if (getRelation) {
         exist = true;
         break;
         }
         }*/
        getArray.forEach(function (obj) {
            var collection = eval(obj.collection);
            var getRelation = collection.findOne(obj.selector);
            if (getRelation) {
                exist = true;
                return false;
            }
        });
        return exist;

    }
});


Meteor.methods({
    findRecords: function (collectionName, selector, option) {
        collectionName = eval(collectionName);
        collectionName.find(selector, option);
    }
});
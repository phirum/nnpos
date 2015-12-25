Meteor.methods({
    findOneRecord: function (collectionName, selector, option) {
        collectionName = eval(collectionName);
        option = option == null ? {} : option;
        collectionName.find(selector, option);
    }
});
Meteor.methods({
    findOneRecord: function (collectionName, selector, option) {
        collectionName = eval(collectionName);
        selector = selector == null ? {} : selector;
        option = option == null ? {} : option;
        return collectionName.findOne(selector, option);
    }
});
Meteor.methods({
    findRecords: function (collectionName, selector, option) {
        collectionName = eval(collectionName);
        selector = selector == null ? {} : selector;
        option = option == null ? {} : option;
        return collectionName.find(selector, option).fetch();
    }
});
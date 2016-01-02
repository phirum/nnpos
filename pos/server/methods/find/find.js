Meteor.methods({
    findRecords: function (collectionName, selector, option) {
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        collectionName = eval(collectionName);
        selector = selector == null ? {} : selector;
        option = option == null ? {} : option;
        return collectionName.find(selector, option).fetch();
    }
});
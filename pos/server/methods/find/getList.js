Meteor.methods({
    getList: function (collectionName, selector, option, hasSelectOne) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        var arr = [];
        if (hasSelectOne) {
            arr.push({value: "", label: "(Select One)"});
        }
        collectionName = eval(collectionName);
        selector = selector == null ? {} : selector;
        option = option == null ? {} : option;
        collectionName.find(selector, option).forEach(function (obj) {
            arr.push({value: obj._id, label: obj._id + " | " + obj.name});
        });
        return arr;
    }
});
Meteor.methods({
    school_listAddress: function (params) {
        check(params, String);

        var list = [];
        Sample.Collection.Location.find({
            $or: [
                {_id: {'$regex': params, '$options': 'i'}},
                {name: {'$regex': params, '$options': 'i'}}
            ]
        }).forEach(function (obj) {
            var label = obj._id + ' | ' + obj.name;
            list.push({label: label, value: obj._id});
        });

        return list;
    }
});
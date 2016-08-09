Meteor.methods({
    customerLocations: function () {
        return Pos.Collection.CustomerLocations.find({}, {fields: {_id: 1, name: 1}}).fetch();
    }
});
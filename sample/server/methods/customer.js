Meteor.methods({
    sample_customerById: function (id) {
        var data = Sample.Collection.Customer.findOne(id);
        data.photoUrl = null;

        if (!_.isUndefined(data.photo)) {
            data.photoUrl = Files.findOne(data.photo)
                .url();
        }
        return data;
    }
});
Meteor.methods({
    sample_orderById: function (id) {
        var data = Sample.Collection.Order.findOne(id);
        return data;
    }
});
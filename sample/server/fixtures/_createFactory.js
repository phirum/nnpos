Meteor.startup(function () {
    if (Sample.Collection.Customer.find({}).count() == 0) {
        _.times(5000, function (n) {
            Factory.create('customer');
        });
    }
});

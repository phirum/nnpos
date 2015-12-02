var branchId = '001';

Factory.define('location', Sample.Collection.Location, {
    _id: function () {
        var locationId = idGenerator.gen(Sample.Collection.Location, 4);
        return locationId;
    },
    name: function () {
        return faker.address.city();
    }
});

Factory.define('customer', Sample.Collection.Customer, {
    _id: function () {
        var customerId = idGenerator.genWithPrefix(Sample.Collection.Customer,
            branchId + '-', 6);
        return customerId;
    },
    name: function () {
        return faker.name.findName()
    },
    gender: function () {
        return faker.random.arrayElement(['M', 'F']);
    },
    dob: function () {
        return moment(faker.date.past()).format('YYYY-MM-DD');
    },
    telephone: function () {
        return faker.phone.phoneNumber();
    },
    email: function () {
        faker.internet.email();
    },
    locationId: function () {
        var location = Factory.create('location');
        return location._id;
    },
    branchId: branchId
});

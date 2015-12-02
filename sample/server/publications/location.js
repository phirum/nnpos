// Publication
//Meteor.publish('sample_location', function () {
//    this.unblock();
//    if (this.userId) {
//
//        return Sample.Collection.Location.find({});
//        //return Sample.Collection.Location.find({}, {removed: true}); // for soft remove
//    }
//
//    this.ready();
//});

Meteor.publish('sample_locationById', function (id) {
    this.unblock();
    if (this.userId) {
        check(id, String);

        return Sample.Collection.Location.find({_id: id});
        //return Sample.Collection.Location.find({}, {removed: true}); // for soft remove
    }

    this.ready();
});

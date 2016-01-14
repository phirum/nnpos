var posLocationTPL = Template.pos_location;
var posLocationInsertTPL = Template.pos_locationInsert;
var posLocationUpdateTPL = Template.pos_locationUpdate;
var posLocationShowTPL = Template.pos_locationShow;

posLocationTPL.onRendered(function () {
    createNewAlertify(['location', 'locationShow']);
});
posLocationTPL.helpers({
    selector: function () {
        var selector = {};
        selector.branchId = Session.get('currentBranch');
        return selector;
    }
});
posLocationTPL.events({
    'click .insert': function (e, t) {
        alertify.location(fa('plus', 'Add New Location'), renderTemplate(posLocationInsertTPL)).maximize();
    },
    'click .update': function (e, t) {
        var data = Pos.Collection.Locations.findOne(this._id);
        alertify.location(fa('pencil', 'Update Existing Location'), renderTemplate(posLocationUpdateTPL, data)).maximize();
    },
    'click .remove': function (e, t) {
        var id = this._id;
        alertify.confirm("Are you sure to delete [" + id + "]?")
            .set({
                onok: function (closeEvent) {
                    var arr = [
                        {collection: 'Pos.Collection.FIFOInventory', selector: {locationId: id}},
                        {collection: 'Pos.Collection.Sales', selector: {locationId: id}},
                        {collection: 'Pos.Collection.Purchases', selector: {locationId: id}},
                        {
                            collection: 'Pos.Collection.LocationTransfers',
                            selector: {$or: [{fromLocationId: id}, {toLocationId: id}]}
                        }
                    ];
                    Meteor.call('isRelationExist', arr, function (error, result) {
                        if (error) {
                            alertify.error(error.message);
                        } else {
                            if (result) {
                                alertify.warning("Data has been used. Can't remove.");
                            } else {
                                Pos.Collection.Locations.remove(id, function (err) {
                                    if (err) {
                                        alertify.error(err.message);
                                    } else {
                                        alertify.success("Success");
                                    }
                                });
                            }
                        }
                    });

                },
                title: '<i class="fa fa-remove"></i> Delete Location'
            });
    },
    'click .show': function (e, t) {
        alertify.locationShow(fa('eye', 'Location Detail'), renderTemplate(posLocationShowTPL, this))
    }
});
AutoForm.hooks({
    // Customer
    pos_locationInsert: {
        before: {
            insert: function (doc) {
                doc.branchId = Session.get('currentBranch');
                return doc;
            }
        },
        onSuccess: function (formType, result) {
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    },
    pos_locationUpdate: {
        onSuccess: function (formType, result) {
            alertify.location().close();
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});


var posCustomerLocationTPL = Template.pos_customerLocation;
var posCustomerLocationInsertTPL = Template.pos_customerLocationInsert;
var posCustomerLocationUpdateTPL = Template.pos_customerLocationUpdate;
var posCustomerLocationShowTPL = Template.pos_customerLocationShow;

posCustomerLocationTPL.onRendered(function () {
    createNewAlertify(['customerLocation', 'customerLocationShow']);
});
posCustomerLocationTPL.helpers({
    selector: function () {
        var selector = {};
        selector.branchId = Session.get('currentBranch');
        return selector;
    }
});
posCustomerLocationTPL.events({
    'click .insert': function (e, t) {
        alertify.customerLocation(fa('plus', 'Add New CustomerLocation'), renderTemplate(posCustomerLocationInsertTPL));
    },
    'click .update': function (e, t) {
        var data = Pos.Collection.CustomerLocations.findOne(this._id);
        alertify.customerLocation(fa('pencil', 'Update Existing CustomerLocation'), renderTemplate(posCustomerLocationUpdateTPL, data));
    },
    'click .remove': function (e, t) {
        var id = this._id;
        var arr = [
            {collection: 'Pos.Collection.FIFOInventory', selector: {customerLocationId: id}},
            {collection: 'Pos.Collection.Sales', selector: {customerLocationId: id}},
            {collection: 'Pos.Collection.Purchases', selector: {customerLocationId: id}},
            {
                collection: 'Pos.Collection.Customers',
                selector: {customerLocationId: id}
            }
        ];
        Meteor.call('isRelationExist', arr, function (error, result) {
            if (error) {
                alertify.error(error.message);
            } else {
                if (result) {
                    alertify.warning("Data has been used. Can't remove.");
                } else {
                    alertify.confirm("Are you sure to delete [" + id + "]?")
                        .set({
                            onok: function (closeEvent) {
                                Pos.Collection.CustomerLocations.remove(id, function (err) {
                                    if (err) {
                                        alertify.error(err.message);
                                    } else {
                                        alertify.success("Success");
                                    }
                                });
                            },
                            title: '<i class="fa fa-remove"></i> Delete CustomerLocation'
                        });
                }
            }
        });


    },
    'click .show': function (e, t) {
        alertify.customerLocationShow(fa('eye', 'CustomerLocation Detail'), renderTemplate(posCustomerLocationShowTPL, this))
    }
});
AutoForm.hooks({
    // Customer
    pos_customerLocationInsert: {
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
    pos_customerLocationUpdate: {
        onSuccess: function (formType, result) {
            alertify.customerLocation().close();
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});


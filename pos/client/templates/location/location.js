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
        var canRemove = (this._productCount == null || this._productCount == 0);
        alertify.confirm("Are you sure to delete [" + id + "]?")
            .set({
                onok: function (closeEvent) {
                    /* var relation = relationExist(
                     [
                     {collection: Pos.Collection.Products, selector: {locationId:id}}
                     ]
                     );*/
                    if (canRemove) {
                        Pos.Collection.Locations.remove(id, function (error) {
                            if (error) {
                                alertify.error(error.message);
                            } else {
                                alertify.success("Success");
                            }
                        });
                    } else {
                        alertify.warning("Data has been used. Can't remove.");
                    }
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


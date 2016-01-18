var posLocationSettingTPL = Template.pos_locationSetting;
var posLocationSettingInsertTPL = Template.pos_locationSettingInsert;
var posLocationSettingUpdateTPL = Template.pos_locationSettingUpdate;
//var posLocationSettingShowTPL = Template.pos_locationSettingShow;

posLocationSettingTPL.onRendered(function () {
    createNewAlertify(['locationSetting', 'locationSettingShow']);
});
posLocationSettingTPL.helpers({
    selector: function () {
        var selector = {};
        selector.branchId = Session.get('currentBranch');
        return selector;
    }
});
posLocationSettingTPL.events({
    'click .insert': function (e, t) {
        var locationSetting = Pos.Collection.LocationSettings.findOne({branchId: Session.get('currentBranch')});
        if (locationSetting != null) {
            alertify.warning('Location Setting is already had.');
        } else {
            alertify.locationSetting(fa('plus', 'Add New LocationSetting'), renderTemplate(posLocationSettingInsertTPL)).maximize();
        }
    },
    'click .update': function (e, t) {
        var data = Pos.Collection.LocationSettings.findOne(this._id);
        alertify.locationSetting(fa('pencil', 'Update Existing LocationSetting'), renderTemplate(posLocationSettingUpdateTPL, data)).maximize();
    },
    'click .remove': function (e, t) {
        var id = this._id;
        var canRemove = (this._saleCount == null || this._saleCount == 0);
        alertify.confirm("Are you sure to delete [" + id + "]?")
            .set({
                onok: function (closeEvent) {
                    if (canRemove) {
                        Pos.Collection.LocationSettings.remove(id, function (error) {
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
                title: '<i class="fa fa-remove"></i> Delete LocationSetting'
            });

    },
    /* 'click .show': function (e, t) {
     alertify.locationSettingShow(fa('eye','LocationSetting Detail'),renderTemplate(posLocationSettingShowTPL, this));
     }*/
});

AutoForm.hooks({
    // LocationSetting
    pos_locationSettingInsert: {
        before: {
            insert: function (doc) {
                doc.branchId = Session.get('currentBranch');
                return doc;
            }
        },
        onSuccess: function (formType, result) {
            alertify.locationSetting().close();
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    },
    pos_locationSettingUpdate: {
        onSuccess: function (formType, result) {
            alertify.locationSetting().close();
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});



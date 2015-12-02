var posUserStaffTPL = Template.pos_userStaff;
var posUserStaffInsertTPL = Template.pos_userStaffInsert;
var posUserStaffUpdateTPL = Template.pos_userStaffUpdate;
var posUserStaffShowTPL = Template.pos_userStaffShow;

posUserStaffTPL.onRendered(function () {
    createNewAlertify(['userStaff', 'userStaffShow']);
});
posUserStaffTPL.helpers({
    selector: function () {
        return {branchId: Session.get('currentBranch')};
    }
});
posUserStaffTPL.events({
    'click .insert': function (e, t) {
        alertify.userStaff(fa('plus', 'Add New User Staff Mapping'), renderTemplate(posUserStaffInsertTPL)).maximize();
    },
    'click .update': function (e, t) {
        var data = Pos.Collection.UserStaffs.findOne(this._id);
        alertify.userStaff(fa('pencil', 'Update Existing User Staff Mapping'), renderTemplate(posUserStaffUpdateTPL, data)).maximize();
    },
    'click .remove': function (e, t) {
        var id = this._id;
        alertify.confirm("Are you sure to delete [" + id + "]?")
            .set({
                onok: function (closeEvent) {
                    Pos.Collection.UserStaffs.remove(id, function (error) {
                        if (error) {
                            alertify.error(error.message);
                        } else {
                            alertify.success("Success");
                        }
                    });
                },
                title: '<i class="fa fa-remove"></i> Delete UserStaff'
            });

    },
    'click .show': function (e, t) {
        alertify.userStaffShow(fa('eye','User-Staff Detail'),renderTemplate(posUserStaffShowTPL, this));
    }
});
posUserStaffInsertTPL.helpers({
    userIds: function () {
        var list = [{label: "(Select One)", value: ""}];
        var branchId = Session.get('currentBranch');
        var userIds = Pos.Collection.UserStaffs.find().map(function (us) {
            return us.userId;
        });
        var user = Meteor.users.find({_id: {$not: {$in: userIds}}, username: {$ne: 'super'}});
        user.forEach(function (u) {
            u.rolesBranch.forEach(function (r) {
                if (r == branchId) {
                    list.push({label: u.username, value: u._id});
                    return false;
                }
            });
        });
        return list;
    }
});
posUserStaffUpdateTPL.helpers({
    userIds: function () {
        var list = [{label: "(Select One)", value: ""}];
        var branchId = Session.get('currentBranch');
        var user = Meteor.users.find({username: {$ne: 'super'}});
        user.forEach(function (u) {
            u.rolesBranch.forEach(function (r) {
                if (r == branchId) {
                    list.push({label: u.username, value: u._id});
                    return false;
                }
            });
        });
        return list;
    }
});
AutoForm.hooks({
    // Customer
    pos_userStaffInsert: {
        before: {
            insert: function (doc) {
                var branchId = Session.get('currentBranch');
                doc.branchId = branchId;
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
    pos_userStaffUpdate: {
        onSuccess: function (formType, result) {
            alertify.userStaff().close();
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});

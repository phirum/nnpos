var posCustomerTPL = Template.pos_customer;
var posCustomerInsertTPL = Template.pos_customerInsert;
var posCustomerUpdateTPL = Template.pos_customerUpdate;
var posCustomerShowTPL = Template.pos_customerShow;

posCustomerTPL.onRendered(function () {
    createNewAlertify(['customer', 'customerShow']);
});
posCustomerTPL.helpers({
    selector: function () {
        var selector = {};
        selector.branchId = Session.get('currentBranch');
        return selector;
    }
});
posCustomerTPL.events({
    'click .insert': function (e, t) {
        alertify.customer(fa('plus', 'Add New Customer'), renderTemplate(posCustomerInsertTPL)).maximize();
    },
    'click .update': function (e, t) {
        var data = Pos.Collection.Customers.findOne(this._id);
        alertify.customer(fa('pencil', 'Update Existing Customer'), renderTemplate(posCustomerUpdateTPL, data)).maximize();
    },
    'click .remove': function (e, t) {
        var id = this._id;
        alertify.confirm("Are you sure to delete [" + id + "]?")
            .set({
                onok: function (closeEvent) {
                    var arr = [
                        {collection: 'Pos.Collection.Sales', selector: {customerId: id}}
                    ];
                    Meteor.call('isRelationExist', arr, function (error, result) {
                        if (error) {
                            alertify.error(error.message);
                        } else {
                            if (result) {
                                alertify.warning("Data has been used. Can't remove.");
                            } else {
                                Pos.Collection.Customers.remove(id, function (err) {
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
                title: '<i class="fa fa-remove"></i> Delete Customer'
            });

    },
    'click .show': function (e, t) {
        alertify.customerShow(fa('eye', 'Customer Detail'), renderTemplate(posCustomerShowTPL, this));
    }
});

AutoForm.hooks({
    // Customer
    pos_customerInsert: {
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
        },
        after: {
            insert: function () {
                $('select[name="gender"]').select2('val', '');
            }
        }
    },
    pos_customerUpdate: {
        onSuccess: function (formType, result) {
            alertify.customer().close();
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        },
        after: {
            update: function () {
                $('select[name="gender"]').select2('val', '');
            }
        }
    }
});


